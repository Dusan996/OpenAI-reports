import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import { ProtectedRoute } from './components/protectedRoute'
import { Login } from './components/auth/Login'
import { Layout } from './components/layout/Layout'
import './App.css'
import { ReportList } from './components/reports/ReportList'
import { NotFound } from './components/notFound/NotFound'

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Login />,
	},
	{
		element: <ProtectedRoute />,
		children: [
			{
				path: '/reports',
				element: (
					<Layout>
						<ReportList />
					</Layout>
				),
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
])

const App: React.FC = () => {
	return (
		<AuthProvider>
			<RouterProvider router={routes} />
		</AuthProvider>
	)
}

export default App
