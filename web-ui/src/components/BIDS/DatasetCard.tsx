import React, { useState } from 'react'
import { Close, Delete, Edit } from '@mui/icons-material'
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Typography
} from '@mui/material'
import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { deleteBidsDataset } from '../../api/gatewayClientAPI'
import { BIDSDataset } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import { nameToColor } from '../theme'
import DatasetInfo from './DatasetInfo'
import EditDataset from './EditDataset'

const DatasetCard = ({ dataset, refresh }: { dataset: BIDSDataset, refresh: () => void }) => {
	const modalRef = useRef<ModalComponentHandle>(null)
	const { showNotif } = useNotification()
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const handleDeleteDataset = async (id: string): Promise<void> => {
		if (!modalRef.current) return
		const reply = await modalRef.current.open(
			'Delete dataset ?',
			'Deleting a dataset will remove all associated experiments and results. Are you sure you want to delete this dataset?'
		)

		if (reply) {
			deleteBidsDataset(id).then(() => {
				showNotif('Deleted dataset', 'success')
				refresh()
			}).catch(() => {
				showNotif('Could not delete dataset', 'error')
			})
		}
	}

	const handleEditDataset = async (id: string): Promise<void> => {
		setIsEditDialogOpen(true)
	}

	const handleDatasetEdited = () => {
		setIsEditDialogOpen(false)
		refresh()
	}

	return (
		<>
			<Modal ref={modalRef} />
			<Dialog open={isEditDialogOpen} sx={{ minWidth: '360' }}>
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					Edit BIDS Dataset
					<IconButton
						onClick={() => setIsEditDialogOpen(!isEditDialogOpen)}
					>
						<Close />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<EditDataset dataset={dataset} setDatasetCreated={handleDatasetEdited} />
				</DialogContent>
			</Dialog>

			<Card elevation={3} component={Paper} sx={{ width: 320 }}>
				<NavLink
					to={`${dataset?.Name}`}
					style={{ textDecoration: 'none' }}
				>
					<CardMedia
						sx={{
							background: `linear-gradient(${nameToColor(
								dataset.Name,
								'33'
							)})`
						}}
						component='img'
						height='96'
						alt=''
					/>
				</NavLink>
				<NavLink
					to={`${dataset?.Name}`}
					style={{ textDecoration: 'none' }}
				>
					<CardContent>

						<Typography variant='h6'>{dataset?.Name}</Typography>
						<Typography variant='body2' color='text.secondary'>
							id: {dataset?.Name}
						</Typography>
						<Typography
							sx={{ mt: 2, mb: 2 }}
							variant='body2'
							gutterBottom
							color='text.secondary'
						>
							Authors: <strong>{dataset?.Authors?.join(', ')}</strong>
						</Typography>
						<DatasetInfo dataset={dataset} />
					</CardContent>
				</NavLink>
				<CardActions sx={{ p: 2 }}>
					<IconButton
						color='primary'
						aria-label='edit'
						onClick={() =>
							handleEditDataset(dataset?.Name || '')
						}
					>
						<Edit />
					</IconButton>
					<IconButton
						color='primary'
						aria-label='delete'
						onClick={() =>
							handleDeleteDataset(dataset?.Name || '')
						}
					>
						<Delete />
					</IconButton>
				</CardActions>
			</Card>
		</>
	)
}

DatasetCard.displayName = 'DatasetCard'

export default DatasetCard
