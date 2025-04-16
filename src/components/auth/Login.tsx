import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { USER_ROLES, Role } from '../../constants/roles'

export const Login: React.FC = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { login, addActivity } = useAuth()
	const navigate = useNavigate()

	const handleLogin = () => {
		let role: Role = USER_ROLES.USER
		if (
			(username === 'admin' && password === 'admin') ||
			(username === 'user' && password === 'user')
		) {
			if (username === 'admin') {
				role = USER_ROLES.ADMIN
			}
			login(username, role)
			addActivity(`${username} logged in`)
			navigate('/reports')
		} else {
			alert('Invalid credentials')
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				mt: 10,
			}}>
			<Typography variant="h4" gutterBottom>
				Login
			</Typography>
			<TextField
				label="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value.toLowerCase())}
				sx={{ mb: 2, width: '300px' }}
			/>
			<TextField
				label="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value.toLowerCase())}
				sx={{ mb: 2, width: '300px' }}
			/>
			<Button variant="contained" onClick={handleLogin} sx={{ width: '300px' }}>
				Login
			</Button>
		</Box>
	)
}
