// ConfirmationModal.tsx

import React from 'react';
import '../../../scss/App.scss';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>{message}</h2>
                <div className="modal-actions">
                    <button className="modal-button" onClick={onConfirm}>
                        Yes, Delete
                    </button>
                    <button className="modal-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
