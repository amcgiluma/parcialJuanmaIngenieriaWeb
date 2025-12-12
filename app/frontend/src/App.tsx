import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './presentation/context/AuthContext';
import Login from './presentation/pages/Login';
import Dashboard from './presentation/pages/Dashboard';
import { useEffect, useState } from 'react';

// Componente para proteger rutas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    // Podemos añadir lógica de loading si el estado de auth se verifica asíncronamente
    // Pero con localStorage es síncrono en inicio.

    // Check localstorage manually for initial flash prevention
    const token = localStorage.getItem('google_token');
    if (!isAuthenticated && !token) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Necesitamos un wrapper interno para acceder al contexto
const AppRoutes = () => {
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        // Simple init check
        setIsInit(true);
    }, []);

    if (!isInit) return null;

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
