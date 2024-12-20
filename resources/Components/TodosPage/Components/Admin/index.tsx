import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';  // Import useLocation hook
import { FaTshirt, FaUser, FaCog, FaUserEdit, FaTasks, FaPalette } from 'react-icons/fa';

const APP_NAME = process.env.APP_NAME;

const AdminPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Track sidebar visibility for mobile
    const location = useLocation(); // Get current location

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen); // Toggle the sidebar visibility on mobile
    };

    const closeSidebar = () => {
        setSidebarOpen(false); // Close the sidebar manually
    };

    // Function to check if the current path matches the link
    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : ''; // Add 'active' class if path matches
    };

    return (
        <div className="admin-page">
            {/* Sidebar Button (Mobile Only) */}
            <button
                className="admin-page-sidebar-button"
                onClick={toggleSidebar}
                style={{ display: sidebarOpen ? 'none' : 'block' }} // Hide button when sidebar is open
            >
                &#9776; {/* Hamburger Icon */}
            </button>

            {/* Sidebar */}
            <aside className={`admin-page-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-page-header">
                    <h1>{APP_NAME}</h1>
                    {/* Close Button (Mobile Only) */}
                </div>

                {/* Overview Section */}
                <section className="sidebar-section">
                    <h2>Overview</h2>
                    <nav className="admin-page-nav-menu">
                        <ul>
                            <li><a href="/admin/todos" className={`admin-page-a ${isActive('/admin/todos')}`}><FaTasks /> Todos</a></li>
                            <li><a href="/admin/users" className={`admin-page-a ${isActive('/admin/users')}`}><FaUser /> Users</a></li>
                        </ul>
                    </nav>
                </section>

                {/* Edit Section */}
                <section className="sidebar-section">
                    <h2>Edit</h2>
                    <nav className="admin-page-nav-menu">
                        <ul>
                            <li><a href="/admin/users" className={`admin-page-a ${isActive('/admin/edit/users')}`}><FaUserEdit /> Users</a></li>
                            <li><a href="/admin/todos" className={`admin-page-a ${isActive('/admin/edit/todos')}`}><FaTasks /> Todos</a></li>
                            <li><a href="/admin/assignments" className={`admin-page-a ${isActive('/admin/assignments')}`}><FaTshirt /> Assignments</a></li>
                        </ul>
                    </nav>
                </section>

                {/* Customize Section */}
                <section className="sidebar-section">
                    <h2>Customize</h2>
                    <nav className="admin-page-nav-menu">
                        <ul>
                            <li><a href="/admin/colors" className={`admin-page-a ${isActive('/admin/colors')}`}><FaPalette /> Colors</a></li>
                            <li><a href="/admin/elements" className={`admin-page-a ${isActive('/admin/elements')}`}><FaCog /> Elements</a></li>
                        </ul>
                    </nav>
                </section>
            </aside>

            {/* Main Content */}
            <main className="admin-page-content">
                <Outlet /> {/* This will render the nested routes like ColorSettings, Users, etc. */}
            </main>
        </div>
    );
};

export default AdminPage;
