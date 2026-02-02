import React from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import Footer from "../../components/layout/Footer";

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
            <PublicHeader />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Effective Date: January 27, 2026</p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">What are cookies?</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember if you have been to the website before.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">How we use cookies</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We use cookies to understand how you use our site, to personalize your experience, and to improve our services. We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period of time or until you delete them).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Your Choices</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CookiePolicy;
