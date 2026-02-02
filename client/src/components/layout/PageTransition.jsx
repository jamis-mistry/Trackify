import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";
import { Zap } from "lucide-react"; // Importing an icon for the logo

const PageTransition = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                className="min-h-screen w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }} // Fast fade code content content itself, optional
            >
                {/* The Slide/Splash Overlay */}
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-600"
                    initial={{ scaleY: 1 }} // Start covering the screen (from previous exit or initial load)
                    animate={{
                        scaleY: 0,
                        transition: { duration: 0.5, ease: "circOut", delay: 0.4 },
                    }} // Reveal the content
                    exit={{
                        scaleY: 1,
                        transition: { duration: 0.4, ease: "circIn" },
                    }} // Cover the screen
                    style={{ originY: 1 }} // Animate from bottom
                >
                    {/* Logo/Spinner in the Splash Screen */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-2 text-white"
                    >
                        <Zap size={64} fill="currentColor" />
                        <h1 className="text-3xl font-bold tracking-wider">TRACKIFY</h1>
                    </motion.div>
                </motion.div>

                {/* Content */}
                <div className="w-full h-full">
                    <Outlet />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
