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
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { getAllBidsDataset, getContext, setContext } from '../../api/gatewayClientAPI'
import { BIDSDataset } from '../../api/types'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import DatasetCard from './DatasetCard'
import { API_DOC_URL } from '../../constants'
import FileChooser from '../UI/FileChooser'

const Datasets = () => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasets, setDatasets] = useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()
	const [loading, setLoading] = useState(false)
	const [path, setPath] = useState<string | undefined>()
	const [selectedFile, setSelectedFile] = useState<string>('/')
	const [showBIDSPathDialog, setShowBIDSPathDialog] = useState(false)

	useEffect(() => {
		getContext().then(data => {
			setPath(data)
		})
	}, [])

	const getBidsDatasets = useCallback(() => {
		getAllBidsDataset().then((data) => {
			setDatasets({ data: data })
			setLoading(false)
		})
	}, [path])

	useEffect(() => {
		setLoading(true)
		getBidsDatasets()
	}, [getBidsDatasets])

	const handleDatasetCreated = () => {
		setIsCreateDialogOpen(false)
		getBidsDatasets()
	}

	const handleSetBIDSPath = () => {
		setContext(selectedFile).then(data => {
			setPath(data)
			setShowBIDSPathDialog(!showBIDSPathDialog)
		})
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
				title={`BIDS Datasets`}
				description={`Path: ${path}`}
				button={
					<Box sx={{ display: 'flex' }}>
						<Button
							color='secondary'
							size='small'
							sx={{ m: 2 }}
							onClick={() => setShowBIDSPathDialog(!showBIDSPathDialog)}
							variant={'contained'}
						>
							Set BIDS path
						</Button>
						<Button
							color='secondary'
							size='small'
							sx={{ m: 2 }}
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
							<DatasetCard key={dataset.Name} dataset={dataset} refresh={getBidsDatasets} />
						))}
					</Box>
				</Box>
				{showBIDSPathDialog && <Box sx={{ display: 'flex', gap: 4, alignItems: 'start' }}>
					<Box sx={{ flexGrow: 1 }}>
						<FileChooser
							handleSelectedFile={path => setSelectedFile(path)}
						/>
					</Box>
					<Button onClick={handleSetBIDSPath}>Set path</Button>
				</Box>
				}
				<Link onClick={() => window.open(API_DOC_URL)}>Swagger API</Link>
			</Box>
		</>
	)
}

export default Datasets
