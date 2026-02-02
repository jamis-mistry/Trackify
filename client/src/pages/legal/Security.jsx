import React from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import Footer from "../../components/layout/Footer";
import { Shield, Lock, Server, Eye } from "lucide-react";

const Security = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
            <PublicHeader />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <Shield size={64} className="mx-auto text-indigo-600 mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Security at Trackify</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Your data security is our top priority.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800">
                        <Lock className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Encryption</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher. Data at rest is also encrypted using industry-standard AES-256 encryption.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800">
                        <Server className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Infrastructure</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our infrastructure is hosted on secure, compliant cloud providers with 24/7 monitoring and automated threat detection systems.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800">
                        <Eye className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Access Control</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Strict role-based access controls ensure that only authorized personnel have access to sensitive data, and only when necessary for their role.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800">
                        <Shield className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Compliance</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            We regularly undergo security audits and penetration testing to identify and address potential vulnerabilities.
                        </p>
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center">
                    <h3 className="text-2xl font-bold mb-2">Report a Vulnerability</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        If you believe you have found a security vulnerability in Trackify, please let us know immediately.
                    </p>
                    <a href="mailto:security@trackify.com" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">Contact Security Team</a>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Security;
