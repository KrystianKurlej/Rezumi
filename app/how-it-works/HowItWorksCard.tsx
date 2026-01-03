import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HowItWorksCardProps {
    title: string;
    description: string;
    imageSrc: string;
    url: string;
}

export default function HowItWorksCard({title, description, imageSrc, url}: HowItWorksCardProps) {
    return (
        <article>
            <Link href={url} title={title}>
                <div className="w-full aspect-[16/9] bg-gray-200 rounded"></div>
            </Link>
            <h3 className="text-lg font-medium mt-2">Create and Manage CV Versions</h3>
            <p className="text-gray-600 mt-1 mb-2 text-sm">Easily create multiple versions of your CV tailored to different job applications. Update and manage your CVs with just a few clicks.</p>
            <Button variant="link" asChild className="px-0">
                <Link href={url} title={title}>
                    Learn More
                    <i className="bi bi-arrow-right"></i>
                </Link>
            </Button>
        </article>
    )
}