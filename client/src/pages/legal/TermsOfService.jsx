import React from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import Footer from "../../components/layout/Footer";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
            <PublicHeader />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="mb-4 text-gray-600 dark:text-gray-400">Last updated: January 27, 2026</p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            By accessing or using Trackify, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">2. User Conduct</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            You agree not to use Trackify for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You are responsible for all activity that occurs under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">3. Limitation of Liability</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Trackify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">4. Termination</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We reserve the right to terminate or suspend your account access immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
