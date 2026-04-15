import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"

const MAX_URL_LENGTH = 2048
const MAX_HTML_BYTES = 1_500_000
const FETCH_TIMEOUT_MS = 12_000

type JobOfferResult = {
  found: boolean
  jobTitle?: string
  companyName?: string
  salary?: number
  salaryCurrency?: string
  url?: string
}

function isLikelyIPv4(hostname: string) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
}

function ipv4ToOctets(ip: string): number[] | null {
  const parts = ip.split(".").map((p) => Number(p))
  if (parts.length !== 4) return null
  if (parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null
  return parts
}

function isPrivateOrLocalAddress(hostname: string) {
  const host = hostname.toLowerCase()

  if (host === "localhost" || host.endsWith(".localhost")) return true
  if (host === "0.0.0.0" || host === "127.0.0.1" || host === "::1") return true

  // Block obvious link-local / private IPv6 ranges (best-effort).
  if (host.includes(":")) {
    if (host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) return true
  }

  if (!isLikelyIPv4(host)) return false

  const o = ipv4ToOctets(host)
  if (!o) return true

  const [a, b] = o

  // RFC1918, loopback, link-local, CGNAT
  if (a === 10) return true
  if (a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true

  // Other reserved ranges that should never be fetched.
  if (a === 0) return true
  if (a >= 224) return true

  return false
}

function parseSalary(baseSalary: any): { salary?: number; salaryCurrency?: string } {
  if (!baseSalary || typeof baseSalary !== "object") return {}

  const salaryCurrency =
    typeof baseSalary.currency === "string" ? baseSalary.currency :
    typeof baseSalary.salaryCurrency === "string" ? baseSalary.salaryCurrency :
    undefined

  const value = (baseSalary as any).value
  if (typeof value === "number") return { salary: value, salaryCurrency }
  if (typeof value === "string") {
    const n = Number(value.replace(/[^0-9.,-]/g, "").replace(",", "."))
    return Number.isFinite(n) ? { salary: n, salaryCurrency } : { salaryCurrency }
  }

  if (value && typeof value === "object") {
    const candidates = [value.value, value.minValue, value.maxValue]
    for (const c of candidates) {
      if (typeof c === "number" && Number.isFinite(c)) return { salary: c, salaryCurrency }
      if (typeof c === "string") {
        const n = Number(c.replace(/[^0-9.,-]/g, "").replace(",", "."))
        if (Number.isFinite(n)) return { salary: n, salaryCurrency }
      }
    }
  }

  return { salaryCurrency }
}

function hasJobPostingType(obj: any) {
  const t = obj?.["@type"]
  if (typeof t === "string") return t.toLowerCase() === "jobposting"
  if (Array.isArray(t)) return t.some((x) => typeof x === "string" && x.toLowerCase() === "jobposting")
  return false
}

function findJobPostings(node: any, out: any[], depth = 0): void {
  if (!node || depth > 12) return

  if (Array.isArray(node)) {
    for (const item of node) findJobPostings(item, out, depth + 1)
    return
  }

  if (typeof node !== "object") return

  if (hasJobPostingType(node)) out.push(node)

  // Common container keys.
  const graph = (node as any)["@graph"]
  if (graph) findJobPostings(graph, out, depth + 1)

  for (const v of Object.values(node)) {
    if (v && (typeof v === "object" || Array.isArray(v))) {
      findJobPostings(v, out, depth + 1)
    }
  }
}

function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = []
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(html))) {
    const raw = match[1]?.trim()
    if (!raw) continue

    // Some sites wrap JSON in HTML comments.
    const cleaned = raw
      .replace(/^<!--/, "")
      .replace(/-->$/, "")
      .trim()

    if (cleaned) blocks.push(cleaned)
  }
  return blocks
}

async function readResponseTextWithLimit(res: Response, limitBytes: number) {
  if (!res.body) {
    const t = await res.text()
    return t.length > limitBytes ? t.slice(0, limitBytes) : t
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let text = ""
  let bytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue

    const remaining = limitBytes - bytes
    if (remaining <= 0) {
      await reader.cancel()
      break
    }

    if (value.byteLength > remaining) {
      text += decoder.decode(value.subarray(0, remaining), { stream: true })
      bytes += remaining
      await reader.cancel()
      break
    }

    bytes += value.byteLength
    text += decoder.decode(value, { stream: true })
  }

  text += decoder.decode()
  return text
}

function buildResult(jobPosting: any): JobOfferResult {
  const jobTitle =
    typeof jobPosting?.title === "string" ? jobPosting.title :
    typeof jobPosting?.name === "string" ? jobPosting.name :
    undefined

  const org = jobPosting?.hiringOrganization ?? jobPosting?.hiringOrganization?.[0] ?? jobPosting?.organization
  const companyName = typeof org?.name === "string" ? org.name : undefined

  const { salary, salaryCurrency } = parseSalary(jobPosting?.baseSalary)

  const url = typeof jobPosting?.url === "string" ? jobPosting.url : undefined

  return {
    found: true,
    jobTitle,
    companyName,
    salary,
    salaryCurrency,
    url,
  }
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const inputUrl = typeof body?.url === "string" ? body.url.trim() : ""
  if (!inputUrl) return NextResponse.json({ error: "Missing url" }, { status: 400 })
  if (inputUrl.length > MAX_URL_LENGTH) {
    return NextResponse.json({ error: "URL too long" }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(inputUrl)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "Only http/https URLs are allowed" }, { status: 400 })
  }
  if (target.username || target.password) {
    return NextResponse.json({ error: "URLs with credentials are not allowed" }, { status: 400 })
  }
  if (isPrivateOrLocalAddress(target.hostname)) {
    return NextResponse.json({ error: "This URL is not allowed" }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(target.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; Rezumi/1.0)",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      )
    }

    const html = await readResponseTextWithLimit(res, MAX_HTML_BYTES)

    const blocks = extractJsonLdBlocks(html)
    if (!blocks.length) {
      return NextResponse.json({ found: false } satisfies JobOfferResult, { status: 200 })
    }

    const jobPostings: any[] = []
    for (const block of blocks) {
      try {
        const parsed = JSON.parse(block)
        findJobPostings(parsed, jobPostings)
      } catch {
        // ignore invalid blocks
      }
    }

    const jobPosting = jobPostings[0]
    if (!jobPosting) {
      return NextResponse.json({ found: false } satisfies JobOfferResult, { status: 200 })
    }

    return NextResponse.json(buildResult(jobPosting), { status: 200 })
  } catch (e: any) {
    const message = e?.name === "AbortError" ? "Fetch timeout" : "Failed to fetch URL"
    return NextResponse.json({ error: message }, { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}
