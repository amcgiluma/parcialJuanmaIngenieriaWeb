import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '../../infrastructure/api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

/**
 * Página de inicio de sesión.
 * Permite autenticarse con Google OAuth.
 * 
 * @returns Componente JSX de la página de login
 */
const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    /**
     * Maneja el éxito del login de Google.
     * 
     * @param credentialResponse - Respuesta de Google OAuth
     */
    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                // Enviar el token al backend
                await api.post('/auth/login', { token: credentialResponse.credential });

                // Guardar token
                localStorage.setItem('google_token', credentialResponse.credential);

                // Navegar al dashboard
                navigate('/');
                window.location.reload();
            } catch (error) {
                console.error("Error en login:", error);
            }
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-neo-lime flex items-center justify-center p-4">
            <div className="bg-white border-2 border-neo-black shadow-hard-lg p-10 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold mb-2 font-mono">ReViews</h1>
                <p className="mb-8 text-xl text-gray-600">
                    Tu guía de reseñas de restaurantes, hoteles y más.
                </p>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => {
                            console.log('Error en login');
                        }}
                        useOneTap
                        shape="rectangular"
                        theme="filled_black"
                        size="large"
                    />
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    Inicia sesión con tu cuenta de Google para crear y ver reseñas.
                </p>
            </div>
        </div>
    );
};

export default Login;

