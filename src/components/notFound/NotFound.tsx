import React from 'react'
import { Box, Typography, Button, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import './NotFound.css'

export const NotFound: React.FC = () => {
	const navigate = useNavigate()

	const handleGoBack = () => {
		navigate(-1)
	}

	return (
		<Box className="not_found">
			<Typography variant="h1" gutterBottom>
				404
			</Typography>
			<Typography variant="h5" gutterBottom>
				Page Not Found
			</Typography>
			<Typography variant="body1" gutterBottom>
				The page you are looking for does not exist.
			</Typography>
			<Button variant="contained" onClick={handleGoBack} sx={{ mb: 2 }}>
				Go Back
			</Button>
			<Typography variant="body2">
				Or go to the{' '}
				<Link href="/" underline="hover">
					Home Page
				</Link>
			</Typography>
		</Box>
	)
}
