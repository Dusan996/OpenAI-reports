import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const ProtectedRoute: React.FC = () => {
	const { user } = useAuth()

	console.log(user)

	if (!user.username) {
		return <Navigate to="/" replace />
	}
	return <Outlet />
}
