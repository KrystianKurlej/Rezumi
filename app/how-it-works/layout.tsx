import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";

const breadcrumbItems = [
    { label: "How It Works" },
];

export default function HowItWorksLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <Breadcrumbs items={breadcrumbItems} />
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
            <Footer variant="page" />
        </>
    );
}