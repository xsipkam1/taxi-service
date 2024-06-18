import React from 'react';
import { Navigate } from 'react-router-dom';
import { Roles } from './Roles'

export const ProtectedRoute = ({ element, roles }) => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
        return <Navigate to="/" />;
    }

    if (roles && roles.indexOf(user.role) === -1) {
        switch (user.role) {
            case Roles.CUSTOMER:
                return <Navigate to="/customer" />;
            case Roles.ADMIN:
                return <Navigate to="/admin" />;
            case Roles.DRIVER:
                return <Navigate to="/driver" />;
            default:
                return <Navigate to="/" />;
        }
    }

    return element;
};
