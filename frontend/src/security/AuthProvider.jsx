import React, { createContext, useContext } from 'react';
import axios from './CrossOrigin';
import { Roles } from './Roles'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const login = (user) => {
        if (localStorage.getItem("user")) {
            localStorage.removeItem("user");
        }
        if (user.token && user.role) {
            localStorage.setItem("user", JSON.stringify(user));
            switch (user.role) {
                case Roles.CUSTOMER:
                    window.location.href = '/customer';
                    break;
                case Roles.ADMIN:
                    window.location.href = '/admin';
                    break;
                case Roles.DRIVER:
                    window.location.href = '/driver';
                    break;
                default:
                    window.location.href = '/';
                    break;
            }
        }
    };

    const logout = async () => {
        try {
            const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
            if (userToken) {

                await axios.post('/auth/logout', null, { headers: { Authorization: `Bearer ${userToken}` } });
            }
        } catch (err) { }
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};
