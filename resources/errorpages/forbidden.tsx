import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "./forbidden.scss";
export const ForbiddenPage: React.FC = () => {
    return (
        <div className="forbidden-container">
            <div className="forbidden-content">
                <img
                    src="https://source.unsplash.com/1600x900/?warning,forbidden"
                    alt="Forbidden"
                    className="forbidden-image"
                />
                <div className="message">
                    <FaExclamationTriangle className="warning-icon" />
                    <h2>403 Forbidden</h2>
                    <p>You do not have permission to access this page.</p>
                </div>
            </div>
        </div>
    );
};
