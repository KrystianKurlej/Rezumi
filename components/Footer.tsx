import Link from 'next/link';

export default function Footer({ variant = 'sidebar' }: { variant?: 'sidebar' | 'page' }) {
    return (
        <div className={`p-4 text-xs text-gray-500 space-y-1 ${variant === 'page' && 'text-center mb-12 mt-24'}`}>
            <p>&copy;{new Date().getFullYear()} Krystian&nbsp;Kurlej, Rezumi </p>
            <p className='underline'><Link href="/privacy-policy">Privacy policy</Link></p>
        </div>
    )
}