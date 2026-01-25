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
  heading?: boolean;
  listItem?: boolean;
}

export function formatRichText(text: string): TextSegment[] {
  if (!text) return [{ text: '' }];
  
  const segments: TextSegment[] = [];
  const lines = text.split('\n');
  
  lines.forEach((line, lineIndex) => {
    // Jeśli linia jest pusta, po prostu dodaj \n i przejdź dalej
    if (line === '') {
      if (lineIndex < lines.length - 1) {
        segments.push({ text: '\n' });
      }
      return;
    }
    
    let remaining = line;
    
    // Przetwarzanie jednej linii
    while (remaining.length > 0) {
      // Szukaj bold **text**
      const boldMatch = remaining.match(/^\*\*(.*?)\*\*/);
      if (boldMatch) {
        segments.push({ text: boldMatch[1], bold: true });
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }
      
      // Szukaj italic *text*
      const italicMatch = remaining.match(/^\*(.*?)\*/);
      if (italicMatch) {
        segments.push({ text: italicMatch[1], italic: true });
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }
      
      // Szukaj kombinacji bold + italic ***text***
      const boldItalicMatch = remaining.match(/^\*\*\*(.*?)\*\*\*/);
      if (boldItalicMatch) {
        segments.push({ text: boldItalicMatch[1], bold: true, italic: true });
        remaining = remaining.slice(boldItalicMatch[0].length);
        continue;
      }

      // Szukaj nagłówków
      const headerMatch = remaining.match(/^(#{1,6})\s+(.*)/);
      if (headerMatch) {
        segments.push({ text: headerMatch[2], heading: true });
        remaining = remaining.slice(headerMatch[0].length);
        continue;
      }


      // Szukaj list punktowanych
      const listItemMatch = remaining.match(/^[-*]\s+(.*)/);
      if (listItemMatch) {
        segments.push({ text: listItemMatch[1], listItem: true });
        remaining = remaining.slice(listItemMatch[0].length);
        continue;
      }
      
      // Szukaj najbliższego specjalnego znaku
      const nextSpecial = remaining.search(/\*\*/);
      if (nextSpecial === -1) {
        // Nie ma więcej specjalnych znaków, dodaj resztę jako zwykły tekst
        if (remaining.length > 0) {
          segments.push({ text: remaining });
        }
        break;
      } else if (nextSpecial > 0) {
        // Dodaj tekst przed specjalnym znakiem
        segments.push({ text: remaining.slice(0, nextSpecial) });
        remaining = remaining.slice(nextSpecial);
      } else {
        // nextSpecial === 0, ale nie pasuje do żadnego wzorca
        // Dodaj pierwszy znak jako zwykły tekst
        segments.push({ text: remaining[0] });
        remaining = remaining.slice(1);
      }
    }
  });
  
  return segments.length > 0 ? segments : [{ text }];
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