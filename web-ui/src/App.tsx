import * as React from 'react'
import { Box, Typography } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Dataset from './components/UI/BIDS/Dataset'
import CenterDatasets from './components/Datasets'
import { isLoggedIn } from './api/gatewayClientAPI'
import { useNotification } from './hooks/useNotification'

export interface Space {
	label: string
	route: string
}

const devNameStyle = {
	position: 'fixed',
	top: '8px',
	right: '200px',
	color: '#F5B800',
	zIndex: '10000',
	transform: 'translateX(-50%)',
}

const Layout = (): JSX.Element => {
	const { showNotif } = useNotification()

	// React.useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		isLoggedIn().catch(error => {
	// 			showNotif(
	// 				'You have been logged out, please refresh your browser',
	// 				'warning'
	// 			)
	// 		})
	// 	}, 30 * 1000)
	// 	return () => clearInterval(interval)
	// }, [showNotif])

	return (
		<Box component='main' sx={{ display: 'flex', width: 'inherit' }}>
			<CssBaseline />
			{/* <Navigation /> */}
			<Box sx={{ m: 4, pl: 1, width: 'inherit' }}>
				<Outlet />
			</Box>
		</Box>
	)
}

const App = () => (
	<Routes>
		<Route path={'/'} element={<Layout />}>
			<Route index element={<CenterDatasets />} />
				<Route path={':datasetId'} element={<Dataset />} />
				<Route
					path='*'
					element={
						<main style={{ padding: '1rem' }}>
							<p>Not found</p>
						</main>
					}
				/>
		</Route>
	</Routes>
)

export default App
