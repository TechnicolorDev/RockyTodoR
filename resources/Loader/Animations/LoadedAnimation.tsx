import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import "../../scss/App.scss"; // Your SCSS file for styling

interface LoadedAnimationProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    flexDirection?: 'row' | 'column'; // Allow 'row' or 'column' as values for flexDirection
    displayOpt?: string; // New prop to specify display type (either 'flex' or 'block')
}

const LoadedAnimation: React.FC<LoadedAnimationProps> = ({
                                                             children,
                                                             delay = 0,
                                                             className = '',
                                                             flexDirection = 'row',
                                                             displayOpt = 'block' // Default to 'block' if no displayOpt provided
                                                         }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -110px 0px',
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [isVisible]);

    return (
        <motion.div
            ref={ref}
            className={`${className} animated-container`}
            initial={{
                opacity: 0,
                y: 30, // Start 30px below
            }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 30,
            }}
            transition={{
                duration: 0.6,
                delay: isVisible ? delay / 1000 : 0,
                ease: [0.65, 0, 0.35, 1],
            }}
            style={{
                position: 'relative',
                transformOrigin: 'center center',
                width: '100%',
                display: displayOpt === 'flex' ? 'flex' : 'block', // Use flex if displayOpt is 'flex', otherwise default to block
                flexDirection: displayOpt === 'flex' ? flexDirection : undefined, // Apply flexDirection only if display is 'flex'
            }}
        >
            {children}
        </motion.div>
    );
};

export default LoadedAnimation;
