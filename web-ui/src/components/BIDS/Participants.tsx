import { Add, Delete, Edit } from '@mui/icons-material'
import {
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createNewParticipantColumn, createParticipant, deleteParticipant, deleteParticipantColumn, editParticipant, getBidsDataset } from '../../api/gatewayClientAPI'
import { BIDSDataset, Participant } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import CreateField from '../UI/createField'
import CreateParticipant from './CreateParticipant'

const Participants = ({
	dataset,
	setDataset,
}: {
	dataset?: BIDSDataset
	setDataset: React.Dispatch<React.SetStateAction<BIDSDataset | undefined>>
}): JSX.Element => {
	const { showNotif } = useNotification()
	const modalRef = useRef<ModalComponentHandle>(null)
	const [rows, setRows] = useState<Participant[]>([])
	const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const [isCreatingField, setIsCreatingColumn] = useState(false)

	useEffect(() => {
		if (dataset?.Participants) setRows(dataset.Participants)
	}, [dataset?.Participants, setRows])

	useEffect(() => {
		if (participantEditId) setIsParticipantDialogOpen(true)
	}, [participantEditId])

	const getDataset = async () => {
		if (!dataset?.Name) { setIsParticipantDialogOpen(false); return }

		return getBidsDataset(dataset?.Name).then((nextDataset) => {
			setDataset(nextDataset)
		}).catch((e) => {
			showNotif('Could not get participants', 'error')
		})
	}

	const handleCreateColumn = ({ key: column }: { key: string }) => {
		if (column) {
			setIsCreatingColumn(true)
			createNewParticipantColumn(dataset?.Name || '', column).then(() => {
				getDataset().then(() => {
					setIsCreatingColumn(false)
				})
			}).catch((e) => {
				showNotif('Could not create field', 'error')
				setIsCreatingColumn(false)
			})
		}
	}

	const handleDeleteColumn = async (column: string): Promise<void> => {
		if (!modalRef.current) return

		const reply = await modalRef.current.open(
			'Delete column ?',
			'Are you sure you want to delete this column? This action is irreversible and will delete all participants data in this column.'
		)

		if (reply) {
			deleteParticipantColumn(dataset?.Name || '', column).then(() => {
				showNotif('Column deleted', 'success')
				getDataset()
			}).catch((e) => {
				showNotif('Could not delete column', 'error')
			})
		}
	}

	const handleCreateParticipant = (
		participant: Participant | undefined
	) => {

		if (!participant || !dataset?.Name) {
			setIsParticipantDialogOpen(false)
				; return
		}

		if (participantEditId) {
			editParticipant(dataset?.Name, participant).then(() => {
				getDataset().then(() => {
					showNotif('Participant saved', 'success')
					setIsParticipantDialogOpen(false)
				})
			}).catch((e) => { showNotif('Could not edit participant', 'error') })
		} else {
			createParticipant(dataset?.Name, participant).then(() => {
				getDataset().then(() => {
					showNotif('Participant edited', 'success')
					setIsParticipantDialogOpen(false)
				})
			}).catch((e) => { setIsParticipantDialogOpen(false); showNotif('Could not create participant', 'error') })
		}

		setParticipantEditId(undefined)
	}

	const handleDeleteParticipant = async (participant_id: string): Promise<void> => {
		if (!dataset?.Name) { return }
		if (!modalRef.current) return

		const reply = await modalRef.current.open(
			'Delete participant ?',
			'Are you sure you want to delete this participant?'
		)

		if (reply) {
			deleteParticipant(dataset.Name, participant_id).then(() => {
				getDataset().then(() => {
					showNotif('Participant deleted', 'success')
				})
			}).catch((e) => {
				showNotif('Could not delete participant', 'error')
			})
		}
	}

	const handleEditParticipant = (id: string) => {
		setParticipantEditId(id)
		setIsParticipantDialogOpen(true)
	}

	const columns = [
		...(dataset?.Participants?.reduce(
			(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
			[] as string[]
		).map((key: string) => ({
			key,
			name: key,
		})) || []),
	]

	return (
		<>
			<Modal ref={modalRef} />
			<CreateParticipant
				dataset={dataset}
				participantEditId={participantEditId}
				open={isParticipantDialogOpen}
				handleCreateParticipant={handleCreateParticipant}
			/>
			<Box sx={{ mt: 2 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'start',
					}}
				>
					<Typography variant='h6'>Participants</Typography>
					<Button
						color='primary'
						size='small'
						sx={{ m: 1 }}
						startIcon={<Add />}
						onClick={() => {
							setParticipantEditId(undefined)
							setIsParticipantDialogOpen(true)
						}}
						variant='contained'
					>
						Add new Participant
					</Button>

				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '16px 16px',
						mt: 2,
					}}
				>
					<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
						<TableContainer sx={{ maxHeight: 440 }}>
							<Table stickyHeader size='small' aria-label='Participants table'>
								<TableHead>
									<TableRow>
										<TableCell padding='checkbox'></TableCell>
										<TableCell padding='checkbox'></TableCell>
										{columns.map(c => (
											<TableCell key={c.name}>

												{c.name}
												{c.name !== 'participant_id' && <IconButton
													color='secondary'
													aria-label='delete'
													onClick={() =>
														handleDeleteColumn(c.name)
													}
												>
													<Delete />
												</IconButton>}
											</TableCell>
										))}
										<TableCell>
											<CreateField
												handleCreateField={handleCreateColumn}
												creating={isCreatingField}
											/>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map(row => (
										<TableRow
											hover
											role='checkbox'
											key={row.participant_id}
										>
											<TableCell padding='checkbox'>
												<IconButton
													color='warning'
													aria-label='delete'
													size='small'
													onClick={() =>
														handleDeleteParticipant(row.participant_id)
													}
												>
													<Delete />
												</IconButton>
											</TableCell>
											<TableCell padding='checkbox'>
												<IconButton
													color='primary'
													aria-label='edit'
													onClick={() =>
														handleEditParticipant(row.participant_id)
													}
												>
													<Edit />
												</IconButton>
											</TableCell>
											{Object.keys(row).map(key => (
												<TableCell key={key}>{`${row[key]}`}</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
					{/* <Box
						elevation={2}
						component={Paper}
						sx={{
							overflow: 'auto',
							p: 1,
							flex: '1 1',
						}}
					>
						<ParticipantInfo subject={selectedSubject} dataset={dataset} />
					</Box> */}
				</Box>
			</Box>
		</>
	)
}

Participants.displayName = 'Participants'

export default Participants
