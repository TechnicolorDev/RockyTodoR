// resources/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./scss/styles.css";  // Import CSS styles
import App from "./App"; // Import the App component

const root = ReactDOM.createRoot(document.getElementById("root")!); // Create root for React 18
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
