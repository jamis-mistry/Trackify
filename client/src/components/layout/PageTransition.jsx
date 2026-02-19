import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";
import Loader from "../common/Loader";

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
                transition={{ duration: 0.1 }}
            >
                {/* The Slide/Splash Overlay */}
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
                    initial={{ scaleY: 1, opacity: 1 }}
                    animate={{
                        scaleY: 0,
                        opacity: 0,
                        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.5 },
                    }}
                    exit={{
                        scaleY: 1,
                        opacity: 1,
                        transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] },
                    }}
                    style={{ originY: 1 }}
                >
                    <div className="flex flex-col items-center gap-10 text-white">
                        <Loader />
                        <h1 className="text-xl font-bold tracking-[0.2em] text-indigo-400/80 animate-pulse">TRACKIFY</h1>
                    </div>
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
