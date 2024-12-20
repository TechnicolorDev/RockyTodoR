import { getColors } from '../../api';  // Import your API function

// This function will fetch the color data and set the CSS variables if necessary.
export const updateCSSVariables = async () => {
    try {
        const colorData = await getColors();  // Get the color data from the API

        // Loop through each color and check if it needs updating
        Object.entries(colorData).forEach(([key, value]) => {
            // Convert the key into the CSS variable format (e.g., primary -> --primary)
            const cssVariableName = `--${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`;

            // Get the current value of the CSS variable
            const currentValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName).trim();

            // If the current value is different from the new value, update it
            if (currentValue !== value) {
                document.documentElement.style.setProperty(cssVariableName, value); // Set the CSS variable in the document root
                console.log(`Updated ${cssVariableName} to ${value}`);
            } else {
                console.log(`No update needed for ${cssVariableName}`);
            }
        });

        console.log('Colors loaded and CSS variables set:', colorData);  // Log the successful color data
    } catch (error) {
        console.error('Error fetching color data:', error);  // Handle any errors
    }
};
