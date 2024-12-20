import React, { createContext, useState, useEffect, useContext } from 'react';
import { getColors, updateColor, resetColors } from '../../api';
import { Color } from '../../api';
interface ColorContextType {
    colors: Color | null;
    handleSaveColor: (name: string, value: string) => Promise<void>;
    handleResetColors: () => Promise<void>;
}

const ColorContext = createContext<ColorContextType | null>(null);

interface ColorProviderProps {
    children: React.ReactNode;
}
export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
    const [colors, setColors] = useState<Color | null>(null);
    const [colorsLoading, setColorsLoading] = useState(true);

    const fetchColors = async () => {
        try {
            const colorData = await getColors();
            setColors(colorData);
            updateCSSVariables(colorData);
        } catch (error) {
            console.error('Error fetching colors:', error);
        } finally {
            setColorsLoading(false);
        }
    };

    const updateCSSVariables = (colors: Color) => {
        Object.keys(colors).forEach((key) => {
            const colorKey = key as keyof Color;
            document.documentElement.style.setProperty(`--${colorKey}`, colors[colorKey]);
        });
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const handleUpdateColors = (colorName: keyof Color, newColor: string) => {
        setColors((prevColors) => {
            if (prevColors) {
                return {
                    ...prevColors,
                    [colorName]: newColor,
                };
            }
            return prevColors;
        });
    };
    const handleSaveColor = async (name: string, value: string) => {
        try {
            await updateColor(name, value);
            setColors((prevColors) => (prevColors ? { ...prevColors, [name]: value } : prevColors));
            document.documentElement.style.setProperty(`--${name}`, value); // Update the CSS variable
        } catch (error) {
            console.error('Error saving color:', error);
        }
    };

    const handleResetColors = async () => {
        try {
            await resetColors();
            fetchColors();
        } catch (error) {
            console.error('Error resetting colors:', error);
        }
    };
    if (colorsLoading) {
        return <div>Loading colors...</div>;
    }

    return (
        <ColorContext.Provider value={{ colors, handleSaveColor, handleResetColors, }}>
            {children}
        </ColorContext.Provider>
    );
};

export const useColors = (): ColorContextType => {
    const context = useContext(ColorContext);
    if (!context) {
        throw new Error('useColors must be used within a ColorProvider');
    }
    return context;
};
