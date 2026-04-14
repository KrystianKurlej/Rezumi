import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dictionary from "./data/dictionary.json"
import languages from "./data/languages.json"
import currencies from "./data/currencies.json"

export function getCurrencySymbol(currencyCode: string): string {
  const currencyEntry = currencies.find(curr => curr.code === currencyCode)
  return currencyEntry ? currencyEntry.symbol : currencyCode
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currencyEntry = currencies.find(curr => curr.code === currencyCode)
  const symbol = currencyEntry ? currencyEntry.symbol : currencyCode

  if (currencyEntry && currencyEntry.side === 'right') {
    return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`
  } else {
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

export function getLanguageName(code: string): string {
  const langEntry = languages.find(lang => lang.code === code)
  return langEntry ? langEntry.name : code
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUnicodeNFC(text: string): string {
  return text.normalize('NFC')
}

export function normalizeUnicodeNFCDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeUnicodeNFC(value) as unknown as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeUnicodeNFCDeep(item)) as unknown as T
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      output[key] = normalizeUnicodeNFCDeep(nested)
    }
    return output as T
  }

  return value
}

export type RichTextSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export type RichTextBlock =
  | { type: 'paragraph'; spans: RichTextSpan[] }
  | { type: 'heading'; level: number; spans: RichTextSpan[] }
  | { type: 'listItem'; spans: RichTextSpan[] }
  | { type: 'blank' };

function mergeAdjacentSpans(spans: RichTextSpan[]): RichTextSpan[] {
  const output: RichTextSpan[] = [];

  for (const span of spans) {
    if (!span.text) continue;
    const last = output[output.length - 1];

    if (last && Boolean(last.bold) === Boolean(span.bold) && Boolean(last.italic) === Boolean(span.italic)) {
      last.text += span.text;
      continue;
    }

    output.push({ ...span });
  }

  return output;
}

function applyInlineStyle(spans: RichTextSpan[], style: { bold?: boolean; italic?: boolean }): RichTextSpan[] {
  return spans.map((span) => ({
    ...span,
    bold: span.bold || style.bold,
    italic: span.italic || style.italic,
  }));
}

function findNextInlineMarker(text: string, startIndex: number): { index: number; marker: '***' | '**' | '*' } | null {
  const markers: Array<'***' | '**' | '*'> = ['***', '**', '*'];

  let bestIndex = -1;
  let bestMarker: '***' | '**' | '*' | null = null;

  for (const marker of markers) {
    const idx = text.indexOf(marker, startIndex);
    if (idx === -1) continue;

    if (bestIndex === -1 || idx < bestIndex || (idx === bestIndex && marker.length > (bestMarker?.length || 0))) {
      bestIndex = idx;
      bestMarker = marker;
    }
  }

  return bestMarker ? { index: bestIndex, marker: bestMarker } : null;
}

function parseInlineMarkdown(text: string): RichTextSpan[] {
  if (!text) return [];

  const spans: RichTextSpan[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const next = findNextInlineMarker(text, cursor);
    if (!next) {
      spans.push({ text: text.slice(cursor) });
      break;
    }

    if (next.index > cursor) {
      spans.push({ text: text.slice(cursor, next.index) });
    }

    const contentStart = next.index + next.marker.length;
    const endIndex = text.indexOf(next.marker, contentStart);

    if (endIndex === -1) {
      // Brak zamknięcia: traktuj marker jako zwykły tekst.
      spans.push({ text: next.marker });
      cursor = contentStart;
      continue;
    }

    const innerText = text.slice(contentStart, endIndex);
    const innerSpans = parseInlineMarkdown(innerText);

    const style = next.marker === '***'
      ? { bold: true, italic: true }
      : next.marker === '**'
        ? { bold: true }
        : { italic: true };

    spans.push(...applyInlineStyle(innerSpans.length > 0 ? innerSpans : [{ text: innerText }], style));
    cursor = endIndex + next.marker.length;
  }

  return mergeAdjacentSpans(spans);
}

export function formatRichText(text: string): RichTextBlock[] {
  if (!text) return [];

  text = normalizeUnicodeNFC(text).replace(/\r\n/g, '\n');

  const blocks: RichTextBlock[] = [];
  const lines = text.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, '');
    const trimmed = line.trim();

    if (!trimmed) {
      blocks.push({ type: 'blank' });
      continue;
    }

    // Nagłówki: wspieramy zarówno "# Title" jak i "#Title".
    const headingMatch = trimmed.match(/^(#{1,6})\s*(\S.*)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        spans: parseInlineMarkdown(headingMatch[2]),
      });
      continue;
    }

    // Lista punktowana: "- item" lub "* item".
    const listMatch = trimmed.match(/^[-*]\s+(\S.*)$/);
    if (listMatch) {
      blocks.push({
        type: 'listItem',
        spans: parseInlineMarkdown(listMatch[1]),
      });
      continue;
    }

    blocks.push({
      type: 'paragraph',
      spans: parseInlineMarkdown(line),
    });
  }

  // Usuń trailing puste bloki (niepotrzebne odstępy na końcu).
  while (blocks.length > 0 && blocks[blocks.length - 1].type === 'blank') {
    blocks.pop();
  }

  return blocks;
}

export function formatDate(dateString: string, variant: 'long' | 'short') {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return '-'
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  if (variant === 'long') {
    return `${day}.${month}.${year}`
  }

  if (variant === 'short') {
    return `${month}.${year}`
  }
  
  return '-'
}

export function translate(lang: string, key: string): string {
  const entry = dictionary[key as keyof typeof dictionary]
  
  if (!entry) return key

  return entry[lang as keyof typeof entry] || entry.en || key
}