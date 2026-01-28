"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const SmoothCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const rotation = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    const rotationSpring = useSpring(rotation, { damping: 50, stiffness: 300 });

    const [isLinkHovered, setIsLinkHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const lastPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            const deltaX = e.clientX - lastPosition.current.x;
            const deltaY = e.clientY - lastPosition.current.y;

            // Calculate rotation based on movement direction
            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                rotation.set(angle);
            }

            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            lastPosition.current = { x: e.clientX, y: e.clientY };

            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' || target.closest('a')) {
                setIsLinkHovered(true);
            } else {
                setIsLinkHovered(false);
            }

            if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
                setIsButtonHovered(true);
            } else {
                setIsButtonHovered(false);
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        const handleMouseDown = () => {
            setIsClicked(true);
        };

        const handleMouseUp = () => {
            setIsClicked(false);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.documentElement.addEventListener("mouseleave", handleMouseLeave);
        document.documentElement.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
            document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isVisible]);

    const isHovered = isLinkHovered || isButtonHovered;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                opacity: isVisible ? 1 : 0,
            }}
        >
            {/* Glow effect behind cursor */}
            <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)",
                }}
                animate={{
                    scale: isClicked ? 1.8 : isHovered ? 1.6 : 1,
                    opacity: isClicked ? 0.4 : isHovered ? 0.3 : 0.2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
            />

            {/* Cursor pointer SVG */}
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className="icon icon-tabler icons-tabler-filled icon-tabler-pointer"
                style={{
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
                    rotate: rotationSpring,
                }}
                animate={{
                    scale: isClicked ? 0.85 : isHovered ? 1.3 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                }}
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M3.039 4.277l3.904 13.563c.185 .837 .92 1.516 1.831 1.642l.17 .016a2.2 2.2 0 0 0 1.982 -1.006l.045 -.078l1.4 -2.072l4.05 4.05a2.067 2.067 0 0 0 2.924 0l1.047 -1.047c.388 -.388 .606 -.913 .606 -1.461l-.008 -.182a2.067 2.067 0 0 0 -.598 -1.28l-4.047 -4.048l2.103 -1.412c.726 -.385 1.18 -1.278 1.053 -2.189a2.2 2.2 0 0 0 -1.701 -1.845l-13.524 -3.89a1 1 0 0 0 -1.236 1.24z"
                    fill="#1a1a1a"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                />
            </motion.svg>
        </motion.div>
    );
};
