import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadedAnimationProps {
    children: React.ReactNode;
    delay?: number; // Optional delay prop in milliseconds
}

const SlideInL: React.FC<LoadedAnimationProps> = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true); // Trigger animation only once
                        observer.unobserve(entry.target); // Stop observing after it's visible
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '0px 0px -120px 0px', // Trigger slightly before it comes into view
            }
        );

        if (ref.current) {
            observer.observe(ref.current); // Observe the element
        }

        // Cleanup the observer on component unmount
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current); // Stop observing
            }
        };
    }, []); // Empty dependency ensures this effect runs only once

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }} // Start off-screen to the left
            animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : -50, // Slide from left when visible
            }}
            transition={{
                duration: 0.6, // Duration of the slide-in animation
                delay: isVisible ? delay / 1000 : 0, // Apply delay once visible
                ease: [0.68, -0.55, 0.27, 1.55], // Smooth easing for smoothness
            }}
            className="loaded-animation" // Class for additional styling
            style={{
                position: 'relative', // Maintain relative positioning for animation
                zIndex: 1001, // Ensure it stays above other elements
                willChange: 'transform, opacity', // GPU acceleration for smooth animations
            }}
        >
            {children}
        </motion.div>
    );
};

export default SlideInL;
