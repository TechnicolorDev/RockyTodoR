// ToastContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';

// Create a context to share toast messages globally
interface ToastContextType {
    showToast: (type: 'success' | 'error', message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const showToast = (type: 'success' | 'error', message: string) => {
        if (type === 'success') {
            toast.success(message, { autoClose: 5000 });
        } else {
            toast.error(message, { autoClose: 5000 });
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};
