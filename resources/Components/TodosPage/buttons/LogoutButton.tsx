import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../api/sessionManager/sessionTerminate';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {

            await logout();

            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="logout-btn">
            Logout
        </button>
    );
};

export default LogoutButton;
