import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <nav className="bg-white sticky top-0 z-10 border-b">
            <div className="max-w-6xl mx-auto flex items-center gap-2 py-2">
                <Logo />
                <ul className="flex-1 flex items-center">
                    <li>
                        <Button variant="link" asChild>
                            <Link href="/how-it-works" title="How it works">
                                How it works
                            </Link>
                        </Button>
                    </li>
                    <li>
                        <Button variant="link" asChild>
                            <Link href="/privacy-policy" title="Privacy">
                                Privacy Policy
                            </Link>
                        </Button>
                    </li>
                </ul>
                <Button asChild>
                    <Link href="/" title="Rezumi">
                        Make your CV
                        <i className="bi bi-arrow-right"></i>
                    </Link>
                </Button>
            </div>
        </nav>
    )
}