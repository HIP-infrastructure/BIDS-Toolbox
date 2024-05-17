import { Add, Close } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Link,
	Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { getAllBidsDataset } from '../../api/gatewayClientAPI'
import { BIDSDataset } from '../../api/types'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import DatasetCard from './DatasetCard'
import { API_DOC_URL } from '../../constants'

const Datasets = () => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasets, setDatasets] = useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()
	const [loading, setLoading] = useState(false)

	const getBidsDatasets = useCallback(() => {
		getAllBidsDataset().then((data) => {
			setDatasets({ data: data })
			setLoading(false)
		})
	}, [])

	useEffect(() => {
		setLoading(true)
		getBidsDatasets()
	}, [getBidsDatasets])

	const handleDatasetCreated = () => {
		setIsCreateDialogOpen(false)
		getBidsDatasets()
	}

	return (
		<>
			<Dialog open={isCreateDialogOpen} sx={{ minWidth: '360' }}>
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					Create BIDS Dataset
					<IconButton
						onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
					>
						<Close />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<CreateDataset setDatasetCreated={handleDatasetCreated} />
				</DialogContent>
			</Dialog>

			<TitleBar
				title='BIDS Datasets'
				button={
					<Box sx={{ display: 'flex' }}>
						<Button
							color='primary'
							size='small'
							sx={{ m: 2 }}
							startIcon={<Add />}
							onClick={() => setIsCreateDialogOpen(true)}
							variant={'contained'}
						>
							Create BIDS Dataset
						</Button>
					</Box>
				}
			/>

			<Box sx={{ mt: 2 }}>
				{datasets?.error && <Alert severity='error'>{datasets?.error}</Alert>}
				<Link onClick={() => window.open(API_DOC_URL)}>Swagger API</Link>

				<Box sx={{ p: 2 }}>
					{datasets?.data?.length === 0 && (
						<Typography variant='body2'>No results</Typography>
					)}
					{!datasets ||
						(loading && (
							<CircularProgress
								size={32}
								color='secondary'
								sx={{ top: 10, left: 10 }}
							/>
						))}
					<Box
						sx={{
							mt: 2,
							mb: 2,
							display: 'flex',
							flexWrap: 'wrap',
							gap: '16px 16px',
						}}
					>
						{datasets?.data?.map(dataset => (
							<DatasetCard key={dataset.Name} dataset={dataset} refresh={getBidsDatasets}/>
						))}
					</Box>
				</Box>
			</Box>
		</>
	)
}

export default Datasets
