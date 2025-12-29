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

type TextSegment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export function formatRichText(text: string): TextSegment[] {
  if (!text) return [{ text: '' }];
  
  const segments: TextSegment[] = [];
  const lines = text.split('\n');
  
  lines.forEach((line, lineIndex) => {
    let remaining = line;
    const lineSegments: TextSegment[] = [];
    
    // Przetwarzanie jednej linii
    while (remaining.length > 0) {
      // Szukaj bold **text**
      const boldMatch = remaining.match(/^\*\*(.*?)\*\*/);
      if (boldMatch) {
        lineSegments.push({ text: boldMatch[1], bold: true });
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }
      
      // Szukaj italic *text*
      const italicMatch = remaining.match(/^\*(.*?)\*/);
      if (italicMatch) {
        lineSegments.push({ text: italicMatch[1], italic: true });
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }
      
      // Szukaj kombinacji bold + italic ***text***
      const boldItalicMatch = remaining.match(/^\*\*\*(.*?)\*\*\*/);
      if (boldItalicMatch) {
        lineSegments.push({ text: boldItalicMatch[1], bold: true, italic: true });
        remaining = remaining.slice(boldItalicMatch[0].length);
        continue;
      }
      
      // Szukaj najbliższego specjalnego znaku
      const nextSpecial = remaining.search(/\*\*/);
      if (nextSpecial === -1) {
        // Nie ma więcej specjalnych znaków, dodaj resztę jako zwykły tekst
        if (remaining.length > 0) {
          lineSegments.push({ text: remaining });
        }
        break;
      } else if (nextSpecial > 0) {
        // Dodaj tekst przed specjalnym znakiem
        lineSegments.push({ text: remaining.slice(0, nextSpecial) });
        remaining = remaining.slice(nextSpecial);
      } else {
        // nextSpecial === 0, ale nie pasuje do żadnego wzorca
        // Dodaj pierwszy znak jako zwykły tekst
        lineSegments.push({ text: remaining[0] });
        remaining = remaining.slice(1);
      }
    }
    
    segments.push(...lineSegments);
  });
  
  return segments.length > 0 ? segments : [{ text }];
}

export function formatDate(dateString: string, variant: 'long' | 'short') {
  const year = dateString.slice(0, 4)
  const month = dateString.slice(5, 7)
  const day = dateString.slice(8, 10)

  if (variant === 'long') {
    return `${day}.${month}.${year}`
  }

  if (variant === 'short') {
    return `${month}.${year}`
  }
}

export function translate(lang: string, key: string): string {
  const entry = dictionary[key as keyof typeof dictionary]
  
  if (!entry) return key

  return entry[lang as keyof typeof entry] || entry.en || key
}