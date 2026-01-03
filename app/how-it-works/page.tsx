import HowItWorksCard from "./HowItWorksCard"

export default function HowItWorksPage() {
    return (
        <main className="p-4">
            <header className="text-center pt-20 pb-24">
                <h1 className="text-4xl font-medium">How It Works</h1>
                <p className="mt-4 text-sm text-gray-600 max-w-lg mx-auto">Rezumi is a simple and intuitive tool designed to help you create and manage multiple versions of your CV with ease. Here&apos;s how it works:</p>
            </header>

            <h2 className="text-3xl font-medium my-8">Learn about the key features of Rezumi</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <HowItWorksCard
                    title="Create and Manage CV Versions"
                    description="Easily create multiple versions of your CV tailored to different job applications. Update and manage your CVs with just a few clicks."
                    imageSrc="/images/how-it-works/create-manage-cv.png"
                    url="/how-it-works#create-manage-cv"
                />
            </section>
        </main>
    )
}