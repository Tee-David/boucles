"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { MoveUpRight as ArrowIcon } from "lucide-react";

interface VisualItem {
    key: number;
    url: string;
    label: string;
}

const visualData: VisualItem[] = [
    {
        key: 1,
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
        label: "Strategic Planning",
    },
    {
        key: 2,
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
        label: "Brand Identity",
    },
    {
        key: 3,
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2670&auto=format&fit=crop",
        label: "Digital Impact",
    },
    {
        key: 4,
        url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop",
        label: "Community Growth",
    },
];

const ImageReveal: React.FC = () => {
    const [focusedItem, setFocusedItem] = useState<VisualItem | null>(null);
    const [isLargeScreen, setIsLargeScreen] = useState(true);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const smoothX = useSpring(cursorX, { stiffness: 300, damping: 40 });
    const smoothY = useSpring(cursorY, { stiffness: 300, damping: 40 });

    useEffect(() => {
        const updateScreen = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return () => window.removeEventListener("resize", updateScreen);
    }, []);

    const onMouseTrack = (e: React.MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    };

    const onHoverActivate = (item: VisualItem) => {
        setFocusedItem(item);
    };

    const onHoverDeactivate = () => {
        setFocusedItem(null);
    };

    return (
        <div
            className="relative mx-auto w-full min-h-fit bg-background rounded-md border-y border-ink overflow-hidden py-10"
            onMouseMove={onMouseTrack}
            onMouseLeave={onHoverDeactivate}
        >
            <div className="container-brutal">
                {visualData.map((item) => (
                    <div
                        key={item.key}
                        className="p-6 cursor-pointer relative sm:flex items-center justify-between border-b border-ink/10 last:border-none hover:bg-ink/5 transition-colors"
                        onMouseEnter={() => onHoverActivate(item)}
                    >
                        {!isLargeScreen && (
                            <img
                                src={item.url}
                                className="sm:w-32 sm:h-20 w-full h-52 object-cover rounded-md mb-4"
                                alt={item.label}
                            />
                        )}
                        <h2
                            className={`font-archivo uppercase md:text-6xl sm:text-4xl text-2xl font-bold py-2 leading-[100%] relative transition-colors duration-300 ${focusedItem?.key === item.key
                                    ? "text-coral z-20"
                                    : "text-ink"
                                }`}
                        >
                            {item.label}
                        </h2>
                        <button
                            className={`sm:block hidden p-4 rounded-full transition-all duration-300 ease-out border-2 border-ink ${focusedItem?.key === item.key
                                    ? "bg-ink text-paper rotate-45"
                                    : "bg-transparent text-ink"
                                }`}
                        >
                            <ArrowIcon className="w-8 h-8" />
                        </button>
                    </div>
                ))}
            </div>

            {isLargeScreen && focusedItem && (
                <motion.img
                    src={focusedItem.url}
                    alt={focusedItem.label}
                    className="fixed z-50 object-cover w-[400px] h-[300px] rounded-lg pointer-events-none shadow-brutal-lg border-4 border-ink"
                    style={{
                        left: smoothX,
                        top: smoothY,
                        x: "-50%",
                        y: "-50%",
                    }}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </div>
    );
};

export default ImageReveal;
