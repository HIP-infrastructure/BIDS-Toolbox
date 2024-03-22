import * as React from 'react'
import { Box, Typography } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Dataset from './components/UI/BIDS/Dataset'
import { useNotification } from './hooks/useNotification'
import CenterDatasets from './components/UI/BIDS/Datasets'

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
