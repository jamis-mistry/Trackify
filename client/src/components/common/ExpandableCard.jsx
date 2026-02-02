import React, { useState, forwardRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandableCard = forwardRef(({ title, content, color = "white", initialHeight = "h-48" }, ref) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = (e) => {
        // Stop propagation so the physics engine doesn't misinterpret this as a drag start if we add drag later
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const colorClasses = {
        white: "bg-white border-gray-200",
        blue: "bg-blue-50 border-blue-200",
        green: "bg-green-50 border-green-200",
        purple: "bg-purple-50 border-purple-200",
        orange: "bg-orange-50 border-orange-200",
    };

    return (
        <div
            ref={ref}
            className={`
        relative rounded-xl border shadow-sm p-6 transition-all duration-300 ease-in-out cursor-default
        ${colorClasses[color] || colorClasses.white}
        ${expanded ? "h-auto" : initialHeight}
        w-full overflow-hidden flex flex-col
      `}
            // Add data-attribute for physics identification if needed
            data-physics="card"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button
                    onClick={toggleExpand}
                    className="p-1 rounded-full hover:bg-black/5 transition-colors text-gray-600 focus:outline-none z-10"
                >
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            <div className="flex-1 text-gray-600 relative">
                <p className={`${expanded ? "" : "line-clamp-3"}`}>
                    {content}
                </p>

                {expanded && (
                    <div className="mt-4 pt-4 border-t border-black/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 p-3 rounded-lg">
                                <p className="text-xs font-semibold uppercase opacity-60">Status</p>
                                <p className="font-medium">Active</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-lg">
                                <p className="text-xs font-semibold uppercase opacity-60">Priority</p>
                                <p className="font-medium">High</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm opacity-80">
                            Additional details that were hidden are now visible. This content expands the card's height, triggering a physics body update.
                        </p>
                    </div>
                )}
            </div>

            {!expanded && (
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
            )}
        </div>
    );
});

export default ExpandableCard;
