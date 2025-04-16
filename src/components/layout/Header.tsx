import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Box, Tabs, Tab } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import LogoutIcon from '@mui/icons-material/Logout'
import './Header.css'

export const Header: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { logout } = useAuth()

	const handleChange = (event: React.SyntheticEvent, goTo: string) => {
		if (goTo === '/logout') {
			logout()
			navigate('/')
		} else {
			navigate(goTo)
		}
	}

	return (
		<Box className="header">
			<Tabs value={location.pathname} onChange={handleChange}>
				<Tab label="Reports" value="/reports" component={Link} to="/reports" />
				<Tab
					className="logout"
					icon={<LogoutIcon />}
					label="Logout"
					value="/logout"
					iconPosition="start"
				/>
			</Tabs>
		</Box>
	)
}
