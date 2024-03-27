import * as React from 'react'
import { Box, Container, Typography } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Dataset from './components/BIDS/Dataset'
import Datasets from './components/BIDS/Datasets'

export interface Space {
	label: string
	route: string
}

const Layout = (): JSX.Element => {
	return (
		<Box component='main' sx={{ display: 'flex' }}>
			<CssBaseline />
			<Container sx={{ m: 4, pl: 1 }}>
				<Outlet />
			</Container>
		</Box>
	)
}

const App = () => (
	<Routes>
		<Route path={'/'} element={<Layout />}>
			<Route index element={<Datasets />} />
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
