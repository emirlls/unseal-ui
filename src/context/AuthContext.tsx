import { createContext, useContext, useState } from 'react';

interface AuthContextType {
    token: string | null;
    userId: string | null;
    login: (token: string, userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

    const login = (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth, AuthProvider içinde kullanılmalı!");
    return context;
};