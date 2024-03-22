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
	Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { getAllBidsDataset } from '../../api/gatewayClientAPI'
import { BIDSDataset } from '../../api/types'
import useDebounce from '../../hooks/useDebounce'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import DatasetCard from './DatasetCard'

const Datasets = ({ handleClickedDataset, buttonTitle }: { handleClickedDataset?: (dataset: BIDSDataset) => void, buttonTitle?: string }) => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasets, setDatasets] = useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		getAllBidsDataset().then((data) => {
			setDatasets({ data: data })
			setLoading(false)
		})
	}, [getAllBidsDataset])

	const handleDatasetCreated = () => {
		setIsCreateDialogOpen(false)
		getAllBidsDataset().then((data) => {
			setDatasets({ data: data })
			setLoading(false)
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
							<DatasetCard key={dataset.Name} dataset={dataset}>
								{handleClickedDataset && <Button
									size='small'
									onClick={async e => {
										e.preventDefault()
										// eslint-disable-next-line no-console
										handleClickedDataset(dataset)
									}}
								>
									{buttonTitle}
								</Button>}
							</DatasetCard>
						))}
					</Box>
				</Box>
			</Box>
		</>
	)
}

export default Datasets
