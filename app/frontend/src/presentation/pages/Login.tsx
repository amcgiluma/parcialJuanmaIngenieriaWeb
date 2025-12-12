import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '../../infrastructure/api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                // Enviar el token al backend
                await api.post('/auth/login', { token: credentialResponse.credential });

                // Guardar token
                localStorage.setItem('google_token', credentialResponse.credential);

                // Navigate to home instead of reload
                navigate('/');
                window.location.reload(); // Force reload to update auth context
            } catch (error) {
                console.error("Login backend error", error);
            }
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-neo-lime flex items-center justify-center p-4">
            <div className="bg-white border-2 border-neo-black shadow-hard-lg p-10 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold mb-6 font-mono">MiMapa</h1>
                <p className="mb-8 text-xl">Tu bitácora de viajes estilo Neo-Brutalist.</p>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                        shape="rectangular"
                        theme="filled_black"
                        size="large"
                    />
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    Ingresa con tu cuenta de Google para empezar a añadir marcadores.
                </p>
            </div>
        </div>
    );
};

export default Login;
