import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRichText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/__(.*?)__/g, '<u>$1</u>') // Underline
    .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/\n/g, '<br/>') // New lines
    .replace(/• (.*?)(<br\/>|$)/g, '<ul><li>$1</li></ul>') // Bullet points
    .replace(/1\. (.*?)(<br\/>|$)/g, '<ol><li>$1</li></ol>') // Numbered lists
}