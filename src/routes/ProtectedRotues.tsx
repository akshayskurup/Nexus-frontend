import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({ children }: any) {
    const user = useSelector((state:any) => state.auth.user);
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoutes;
