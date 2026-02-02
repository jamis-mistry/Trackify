import React from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import Footer from "../../components/layout/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
            <PublicHeader />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Last updated: January 27, 2026</p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account, submit a complaint, or contact us for support. This may include your name, email address, and the details of your complaints.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We use the information we collect to operate and improve our services, facilitate the resolution of complaints, sending you technical notices and support messages, and to communicate with you about products, services, and events.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">3. Data Sharing</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We do not share your personal information with third parties except as described in this policy, such as when necessary to resolve a complaint (sharing with the relevant organization) or as required by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">4. Contact Us</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at privacy@trackify.com.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
