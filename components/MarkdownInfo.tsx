import Link from 'next/link'

export default function MarkdownInfo() {
    return(
        <small className="text-ring text-xs">
            Markdown supported. Learn more about&nbsp;
            <Link
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
            >
                Markdown syntax <i className="bi bi-arrow-up-right"></i>
            </Link>.
        </small>
    )
}