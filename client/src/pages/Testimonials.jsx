import React from "react";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "HR Manager",
        company: "TechFlow Inc.",
        content: "Trackify has completely transformed how we handle internal grievances. The transparency and speed are unmatched.",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Director of Operations",
        company: "ConstructCo",
        content: "Finally, a system that doesn't feel like a chore to use. Our team loves the simplicity and the mobile-friendly design.",
        rating: 5
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Community Lead",
        company: "GreenValley HOA",
        content: "We use Trackify to manage resident requests. It's been a game-changer for keeping our community happy and heard.",
        rating: 4
    },
    {
        id: 4,
        name: "David Wilson",
        role: "Principal",
        company: "Oakwood Academy",
        content: "Administrative efficiency has gone up 40% since we implemented Trackify for staff and student feedback.",
        rating: 5
    },
    {
        id: 5,
        name: "Amanda Martinez",
        role: "Customer Success",
        company: "RetailGiant",
        content: "The analytics feature helps us spot recurring issues before they become big problems. Highly recommended!",
        rating: 5
    },
    {
        id: 6,
        name: "James Thompson",
        role: "CEO",
        company: "StartUp Lab",
        content: "Cost-effective, scalable, and beautiful. Trackify is exactly what we needed for our growing team.",
        rating: 4
    }
];

const Testimonials = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
            <PublicHeader />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Loved by Teams Everywhere
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Don't just take our word for it. See what our users have to say about Trackify.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 relative hover:shadow-lg transition-shadow duration-300">
                                <Quote className="absolute top-6 right-6 text-indigo-200 dark:text-indigo-900/30" size={48} />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={`${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed relative z-10">
                                    "{t.content}"
                                </p>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{t.role}, {t.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Testimonials;
