import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleProtectedRoute from './Protector/RouteProtector'; // Adjust the path if needed
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from './scss/ToastContext'; // Import the ToastProvider
import 'react-toastify/dist/ReactToastify.css';
import { ColorProvider } from './api/Providers/Color/ColorContext';
import { getColors } from './api/api';
import { todoRoutes } from './scripts/routes/todoRouter/routes'; // Your routes file
import { adminRoutes } from './scripts/routes/AdminRouter/routes'; // Import adminRoutes
import { Roles } from './api/Providers/interfaces/interfaces'; // Your Roles definition

interface RouteConfig {
    path: string;
    component: React.ComponentType<any>;
    protected?: boolean;
    requiredRole?: Roles;
    globalToastMessages?: boolean;  // New property to control toasts for specific routes
    children?: RouteConfig[]; // For nested routes
}

const App: React.FC = () => {
    const [colorsLoaded, setColorsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const preloadColors = async () => {
        try {
            const colorData = await getColors();
            const style = document.createElement('style');
            style.innerHTML = `:root {
                ${Object.entries(colorData)
                .map(([cssVar, colorValue]) => `${cssVar}: ${colorValue};`)
                .join(' ')}
            }`;
            document.head.appendChild(style);
            setColorsLoaded(true);
        } catch (error) {
            console.error('Error preloading colors:', error);
            setColorsLoaded(true);
        }
    };

    useEffect(() => {
        preloadColors();
    }, []);

    useEffect(() => {
        if (colorsLoaded) {
            setTimeout(() => setLoading(false), 500); // Simulate loading finish
        }
    }, [colorsLoaded]);

    if (loading) {
        return <div>Loading...</div>; // Show loading spinner until the app is loaded
    }

    // Define the renderRoutes function with explicit type for 'routes'
    const renderRoutes = (routes: RouteConfig[]) => {
        return routes.map((route) => {
            const { path, component: Component, protected: isProtected, requiredRole, children, globalToastMessages } = route;

            // Show toast for routes with globalToastMessages

            // Only apply RoleProtectedRoute for protected routes (admin routes, etc.)
            if (isProtected) {
                return (
                    <Route
                        key={path}
                        path={path}
                        element={<RoleProtectedRoute element={<Component />} requiredRole={requiredRole!} />}
                    >
                        {children && renderRoutes(children)} {/* Render nested routes */}
                    </Route>
                );
            } else {
                return <Route key={path} path={path} element={<Component />} />; // For non-protected routes
            }
        });
    };

    return (
        <ColorProvider>
            <ToastProvider> {/* Wrap the app with ToastProvider */}
                <Router>
                    <div className="app">
                        {/* ToastContainer to show toasts globally */}
                        <ToastContainer
                            autoClose={5000}
                            position="top-right"
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                        <Routes>
                            {/* Render routes for todos (accessible to all users) */}
                            {renderRoutes(todoRoutes.main)} {/* Render the routes from todoRoutes */}
                            {/* Render admin routes with Role-based protection */}
                            {renderRoutes(adminRoutes.main)} {/* Render the routes from adminRoutes */}
                        </Routes>
                    </div>
                </Router>
            </ToastProvider>
        </ColorProvider>
    );
};

export default App;
