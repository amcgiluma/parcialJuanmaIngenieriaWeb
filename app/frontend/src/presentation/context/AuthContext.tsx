import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import api from '../../infrastructure/api/axiosConfig';
import { User } from '../../domain/types';

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderInternal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('google_token');
            if (token) {
                try {
                    // Verify token with backend and get user data
                    const res = await api.post('/auth/login', { token });
                    setUser(res.data);
                } catch (error) {
                    console.error('Token verification failed', error);
                    localStorage.removeItem('google_token');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const logout = () => {
        googleLogout();
        localStorage.removeItem('google_token');
        setUser(null);
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, login: () => { }, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Wrapper con el Client ID
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthProviderInternal>{children}</AuthProviderInternal>
        </GoogleOAuthProvider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
