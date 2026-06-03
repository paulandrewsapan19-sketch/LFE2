import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    login: (token: string, name: string) => void;
    logout: () => void;
    isLoggedIn: boolean;
    userName: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );
    const [userName, setUserName] = useState<string | null>(
        localStorage.getItem('name')
    );

    const login = (newToken: string, name: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('name', name);
        setToken(newToken);
        setUserName(name);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setToken(null);
        setUserName(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token, userName }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}