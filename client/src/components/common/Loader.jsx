import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Logo Section with Ripples */}
            <div className="relative flex items-center justify-center mb-8">
                {/* Ripple Effect Background - Centered on Logo */}
                <motion.div
                    className="absolute w-32 h-32 bg-indigo-500/20 rounded-full"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute w-32 h-32 bg-purple-500/20 rounded-full delay-75"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />

                {/* Bouncing Logo */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 1.5
                    }}
                    className="relative z-10"
                >
                    <img
                        src="/trackify-logo.png"
                        alt="Loading..."
                        className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    />
                </motion.div>
            </div>

            {/* Text Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <h2 className="text-2xl font-black tracking-wider text-white">
                    TRACKIFY
                </h2>

                {/* Loading Dots */}
                <div className="flex gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-indigo-400"
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Loader;
