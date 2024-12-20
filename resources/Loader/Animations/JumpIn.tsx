import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadedAnimationProps {
    children: React.ReactNode;
    delay?: number; // Optional delay prop in milliseconds
}

const JumpIn: React.FC<LoadedAnimationProps> = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true); // Set visibility to true once the element is in view
                        observer.unobserve(entry.target); // Stop observing after it's visible
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '0px 0px -120px 0px', // Trigger just before the element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current); // Start observing the element
        }

        // Cleanup when component unmounts or ref changes
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [isVisible]); // Only rerun when `isVisible` changes

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }} // Start off slightly below and scaled down
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 20, // "Jump" from below
                scale: isVisible ? 1 : 0.95, // Scale back to normal size
            }}
            transition={{
                duration: 0.6, // Animation duration
                delay: isVisible ? delay / 1000 : 0, // Apply delay only after the element is visible
                ease: [0.68, -0.55, 0.27, 1.55], // Smoother easing for a more natural jump
            }}
            style={{
                position: 'relative', // Relative positioning for animation
                zIndex: 1001, // Ensure it's above other content
                willChange: 'transform, opacity, scale', // Optimize rendering by hinting to the browser
            }}
            className="loaded-animation" // Optional class for additional styling
        >
            {children} {/* Render children passed to this component */}
        </motion.div>
    );
};

export default JumpIn;
