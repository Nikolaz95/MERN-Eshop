import React from 'react'
import { Route } from "react-router-dom";
import ProtectedRoute from '../auth/ProtectedRoute';
import Dashboard from '../admin/Dashboard';


const AdminRoutes = () => {
    return (
        <>
            <Route path="/admin/dashboard" element={
                <ProtectedRoute admin={true} >
                    <Dashboard />
                </ProtectedRoute>
            } />
        </>
    )
}

export default AdminRoutes