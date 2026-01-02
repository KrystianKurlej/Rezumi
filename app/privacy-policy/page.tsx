import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicyPage() {
    return (
        <>
            <div className="p-4">
                <Button variant="secondary" className="sticky top-4" asChild>
                    <Link href="/">
                        <i className="bi bi-arrow-left-short"></i>
                        Back to Home
                    </Link>
                </Button>
                <main className="max-w-2xl mx-auto">
                    <header className="text-center py-12">
                        <h1 className="text-4xl font-medium">Privacy Policy</h1>
                        <p className="mt-2 text-sm text-gray-600">Effective date: January 2nd, 2026</p>
                    </header>

                    <section className="space-y-6">
                        <article>
                            <h2 className="text-2xl font-medium">1. General Information</h2>
                            <p>Rezumi is a tool for creating and managing CV versions. We respect user privacy and ensure data is processed in a minimal, necessary scope.</p>
                            <p className="font-medium mt-2">Rezumi administrator:</p>
                            <p>Krystian Kurlej<br/>Contact: (email to be added)</p>
                        </article>
                        <article>
                        <h2 className="text-2xl font-medium">2. Scope of Processed Data</h2>
                            <p>Rezumi does not require account creation and does not store personal data on the server.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Name and surname</li>
                                <li>Work experience</li>
                                <li>Education</li>
                                <li>Skills</li>
                                <li>CV content</li>
                            </ul>
                            <p className="mt-2">Data is processed locally in the user&apos;s browser and is used solely to generate a CV document. The administrator has no access to CV content.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">3. Data Storage</h2>
                            <p>Data entered in Rezumi is saved locally in the browser, not sent to the server, and can be deleted at any time by clearing browser data.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">4. Cookies</h2>
                            <p>Rezumi may use technical cookies necessary for proper operation. No advertising or tracking cookies are used.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">5. Analytics Tools</h2>
                            <p>Rezumi may use analytics tools (e.g., Google Analytics) for analyzing visits, improving the application, and collecting anonymous usage statistics. Data is aggregated and anonymous.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">6. Data Sharing</h2>
                            <p>The administrator does not sell, share, or disclose user data to third parties.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">7. User Rights</h2>
                            <p>Users have the right to full control over their data, delete local data at any time, and discontinue service use without providing a reason.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">8. Privacy Policy Changes</h2>
                            <p>The privacy policy may be updated to reflect changes in service functionality or applicable regulations. The current version is always available on the Rezumi website.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">9. Contact</h2>
                            <p>For privacy-related inquiries, please contact us at: (email)</p>
                        </article>
                    </section>
                </main>
            </div>
            <Footer variant="page" />
        </>
    )
}