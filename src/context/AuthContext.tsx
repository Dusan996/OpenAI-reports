import React, { createContext, useContext, useState, useEffect } from 'react'
import { Role } from '../constants/roles'

interface AuthContextType {
	user: { username: string | null; role: Role | null }
	login: (username: string, role: Role) => void
	logout: () => void
	activities: string[]
	addActivity: (activity: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('Auth error')
	}
	return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<{
		username: string | null
		role: Role | null
	}>({ username: null, role: null })
	const [activities, setActivities] = useState<string[]>([])

	useEffect(() => {
		const storedUser = localStorage.getItem('user')
		const storedActivities = localStorage.getItem('activities')
		if (storedUser) {
			setUser(JSON.parse(storedUser))
		}
		if (storedActivities) {
			setActivities(JSON.parse(storedActivities))
		}
	}, [])

	const login = (username: string, role: Role) => {
		const newUser = { username, role }
		localStorage.setItem('user', JSON.stringify(newUser))
		setUser(newUser)
	}

	const logout = () => {
		localStorage.removeItem('user')
		localStorage.removeItem('activities')
		setUser({ username: null, role: null })
		setActivities([])
	}

	const addActivity = (activity: string) => {
		const newActivities = [...activities, activity]
		localStorage.setItem('activities', JSON.stringify(newActivities))
		setActivities(newActivities)
	}

	return (
		<AuthContext.Provider
			value={{ user, login, logout, activities, addActivity }}>
			{children}
		</AuthContext.Provider>
	)
}
