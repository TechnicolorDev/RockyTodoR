// /src/api/Providers/Color/ColorProvider.tsx

import React, { useEffect } from 'react';
import { getColors } from '../../api';  // Import your API function

const ColorProvider: React.FC = () => {
    useEffect(() => {
        const loadColorsData = async () => {
            try {
                const colorData = await getColors();

                Object.entries(colorData).forEach(([key, value]) => {
                    const cssVariableName = `--${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`;
                    document.documentElement.style.setProperty(cssVariableName, value);
                });

                console.log('Colors loaded and CSS variables set:', colorData);
            } catch (error) {
                console.error('Error fetching color data:', error);
            }
        };

        loadColorsData();
    }, []);

    return null;  
};

export default ColorProvider;
