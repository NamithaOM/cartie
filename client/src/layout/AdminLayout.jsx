import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
    const {user} = useContext(AuthContext);
    if (!user || user.role !== "admin" ) return <Navigate to="/" replace />
  return (
    <div>

            <Navbar /> 
        <div>
            <Outlet/>
        </div>
    </div>
  )
}
