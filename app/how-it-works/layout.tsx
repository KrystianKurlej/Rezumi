import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HowItWorksLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
            <Footer variant="page" />
        </>
    );
}