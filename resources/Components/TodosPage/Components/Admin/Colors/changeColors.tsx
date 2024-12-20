import React, { useState, useEffect } from 'react';
import { useColors } from '../../../../../api/Providers/Color/ColorContext';
import { ChromePicker } from 'react-color';
import { Color } from '../../../../../api/api';

const ColorSettings: React.FC = () => {
    const { colors, handleSaveColor, handleResetColors} = useColors();
    const [editingColor, setEditingColor] = useState<keyof Color | null>(null); // Track which color is being edited
    const [newColorValue, setNewColorValue] = useState<string>(''); // The current color value for the picker
    const [showPicker, setShowPicker] = useState<boolean>(false); // Track whether the color picker is open
    const [previewColor, setPreviewColor] = useState<string>(''); // Track the preview color dynamically

    // Handle color change when user selects a color
    const handleColorChange = (colorName: keyof Color) => {
        setEditingColor(colorName);
        setNewColorValue(colors![colorName as keyof Color] || ''); // Set the color to be edited
        setPreviewColor(colors![colorName as keyof Color] || ''); // Set the preview color initially
        setShowPicker(true); // Show the color picker
    };

    // Handle the color change in the color picker
    const handleColorValueChange = (color: { hex: string }) => {
        setNewColorValue(color.hex); // Update the color value as the picker changes
        setPreviewColor(color.hex); // Update the preview color dynamically as user adjusts the slider

        if (editingColor) {
            // Update the preview color dynamically in the colors object as well
        }
    };

    // Save the color once user selects it
    const handleSave = async () => {
        if (editingColor && newColorValue) {
            await handleSaveColor(editingColor, newColorValue); // Save color
            setEditingColor(null); // Reset the editing state
            setNewColorValue(''); // Reset the color picker value
            setShowPicker(false); // Close the color picker
        }
    };

    // Save all colors at once
    const handleSaveAll = async () => {
        if (colors) {
            try {
                // Loop through all the colors and save them one by one
                for (const colorName in colors) {
                    if (colors.hasOwnProperty(colorName)) {
                        const colorValue = colors[colorName as keyof Color];
                        // Save each color using the same logic as handleSave
                        await handleSaveColor(colorName as keyof Color, colorValue);
                    }
                }
                console.log('All colors saved!');
            } catch (error) {
                console.error('Error saving all colors:', error);
            }
        } else {
            console.error('No colors available to save');
        }
    };

    // Reset all colors at once
    const handleResetAll = async () => {
        await handleResetColors();
    };

    // Close the picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editingColor && !document.getElementById('color-picker')?.contains(event.target as Node)) {
                setShowPicker(false); // Close the picker if clicked outside
            }
        };

        if (showPicker) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showPicker, editingColor]);

    if (!colors) {
        return <div>Loading colors...</div>; // Ensure colors are available before displaying
    }

    return (
        <div className="color-settings">
            <h2>Color Settings</h2>
            <div className="colors-list">
                {Object.entries(colors).map(([colorName, colorValue]) => (
                    <div key={colorName} className="color-item">
                        <span>{colorName}:</span>
                        <span
                            className="color-box"
                            style={{ backgroundColor: colorValue }}
                        />
                        <button
                            className="edit-btn"
                            onClick={() => handleColorChange(colorName as keyof Color)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* Display the color picker only if a color is being edited */}
            {editingColor && showPicker && (
                <div className="edit-section" id="color-picker">
                    <h3>Edit {editingColor}</h3>
                    <ChromePicker
                        color={newColorValue}
                        onChange={handleColorValueChange}
                    />
                    <button className="save-btn" onClick={handleSave}>Save</button>
                </div>
            )}

            <div className="edit-section">
                <button className="save-btn" onClick={handleSaveAll}>Save All</button>
                <button className="reset-btn" onClick={handleResetAll}>Reset All</button>
            </div>
        </div>
    );
};

export default ColorSettings;
