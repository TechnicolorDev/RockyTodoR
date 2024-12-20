import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadedAnimationProps {
    children: React.ReactNode;
    delay?: number; // Optional delay prop in milliseconds
}

const SlideInFromRight: React.FC<LoadedAnimationProps> = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // IntersectionObserver setup
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true); // Set visibility to true only once
                        observer.unobserve(entry.target); // Stop observing after it becomes visible
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '0px 0px -120px 0px', // Trigger slightly before it comes into the viewport
            }
        );

        // Observe the element when the component is mounted
        if (ref.current) {
            observer.observe(ref.current);
        }

        // Cleanup on unmount
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current); // Cleanup the observer
            }
        };
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 50 }} // Start off-screen to the right
            animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : 50, // Slide in from the right when visible
            }}
            transition={{
                duration: 0.6, // Duration of the animation
                delay: isVisible ? delay / 1000 : 0, // Apply delay only once the element becomes visible
                ease: [0.68, -0.55, 0.27, 1.55], // Smooth easing for the slide-in effect
            }}
            className="loaded-animation" // Add custom class for styling
            style={{
                position: 'relative', // Maintain relative positioning for animation
                zIndex: 1001, // Ensure it's stacked above other content
                willChange: 'transform, opacity', // Enable GPU acceleration for smooth animations
            }}
        >
            {children} {/* Render the children */}
        </motion.div>
    );
};

export default SlideInFromRight;
