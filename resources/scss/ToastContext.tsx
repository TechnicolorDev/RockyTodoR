import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';

// Type for the showToast function
type ShowToast = (message: string, type?: "success" | "error", toastId?: string) => void;

// Create context with ShowToast type as the default value
const ToastContext = createContext<ShowToast | null>(null);

interface ToastProviderProps {
    children: ReactNode; // Explicitly typing children as ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    // Function to show toast
    const showToast: ShowToast = (message, type = "success", toastId) => {
        if (type === "success") {
            toast.success(message, { toastId });
        } else {
            toast.error(message, { toastId });
        }
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast function
export const useToast = (): ShowToast => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
