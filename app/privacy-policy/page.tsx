import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto">
                <main className="p-4">
                    <header className="text-center pt-20 pb-24">
                        <h1 className="text-4xl font-medium">Privacy Policy</h1>
                        <p className="mt-4 text-sm text-gray-600 max-w-lg mx-auto">Effective date: January 2, 2026</p>
                    </header>

                    <section className="space-y-6">
                        <article>
                            <h2 className="text-2xl font-medium">1. General Information</h2>
                            <p>Rezumi is a tool for creating and managing CV versions. We respect user privacy and ensure data is processed in a minimal, necessary scope.</p>
                            <p className="font-medium mt-2">Rezumi administrator:</p>
                            <p>Krystian Kurlej<br/>Contact: [email to be added]</p>
                        </article>
                        <article>
                        <h2 className="text-2xl font-medium">2. Scope of Processed Data</h2>
                            <p>Rezumi does not require account creation and does not store personal data on external servers. All information you provide is stored locally in your browser:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Personal information (name, contact details)</li>
                                <li>Work experience</li>
                                <li>Education history</li>
                                <li>Skills and certifications</li>
                                <li>CV content and templates</li>
                            </ul>
                            <p className="mt-2">All data is processed locally in your browser using IndexedDB storage and is used solely to generate your CV document. The administrator has no access to your CV content.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">3. Data Storage</h2>
                            <p>Data entered in Rezumi is saved locally in your browser&apos;s storage (IndexedDB), not transmitted to external servers, and remains under your complete control. You can delete your data at any time by clearing browser data or using the application&apos;s delete functions.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">4. Cookies</h2>
                            <p>Rezumi uses only essential technical cookies necessary for proper application operation. We do not use advertising, marketing, or third-party tracking cookies.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">5. Analytics</h2>
                            <p>Rezumi uses Vercel Analytics to collect anonymous usage statistics about page visits and application performance. This data is fully anonymized and aggregated - it does not identify individual users and cannot be linked to your CV content. Analytics data helps us improve the application and understand how users interact with the service.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">6. Data Sharing</h2>
                            <p>The administrator does not sell, share, rent, or disclose your data to third parties. Your CV content remains private and is never transmitted from your browser.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">7. User Rights</h2>
                            <p>You have full control over your data at all times. You can access, modify, or delete your locally stored data whenever you wish, and discontinue using the service without providing any reason. No data is retained on our servers after you close the application.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">8. Privacy Policy Changes</h2>
                            <p>This privacy policy may be updated periodically to reflect changes in service functionality or applicable regulations. Any changes will be posted on this page with an updated effective date. The current version is always available on the Rezumi website.</p>
                        </article>
                        <article>
                            <h2 className="text-2xl font-medium">9. Contact</h2>
                            <p>For privacy-related inquiries or questions about your data, please contact us at: [email to be added]</p>
                        </article>
                    </section>
                </main>
            </div>
            <Footer variant="page" />
        </>
    )
}