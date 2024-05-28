import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField,
	Typography,
	InputAdornment
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
	BIDSDataset,
	Participant,
} from '../../api/types'
import { useNotification } from '../../hooks/useNotification'

type IField = Record<string, string>

const validationSchema = Yup.object().shape({
	participant_id: Yup.string().required('ID is required'),
	// age: Yup.string().required('Age is required'),
	// sex: Yup.string().required('Sex is required'),
})

const CreateParticipant = ({
	dataset,
	open,
	handleCreateParticipant,
	participantEditId,
}: {
	dataset?: BIDSDataset
	open: boolean
	handleCreateParticipant: (participant?: Participant) => void
	participantEditId?: string
}) => {
	const { showNotif } = useNotification()
	const [submitted, setSubmitted] = useState(false)
	const [editParticipant, setEditParticipant] = useState<Participant>()
	const [fields, setFields] = useState<string[]>([
		'participant_id',
		'age',
		'sex',
	])
	useEffect(() => {
		if (dataset?.Participants) {
			const firstLine = JSON.parse(JSON.stringify(dataset.Participants)).pop()
			if (firstLine) {
				const participantFields = Object.keys(firstLine)
				setFields(participantFields)
			}
		}
	}, [dataset, participantEditId])

	useEffect(() => {
		if (dataset?.Participants && participantEditId) {
			const participant = dataset?.Participants.find(
				p => p.participant_id === participantEditId
			)
			if (participant) {
				setEditParticipant(participant)
			}
		}
	}, [participantEditId, dataset, submitted])

	const editMode = participantEditId !== undefined
	const initialValues = editMode
		? editParticipant
		: fields?.reduce((a, f) => ({ ...a, [f]: '' }), {})

	return (
		<Dialog open={open} sx={{ minWidth: '360' }}>
			<DialogTitle
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant='h6'>
					{editMode ? 'Edit' : 'Create'} Participant
				</Typography>
				<IconButton onClick={() => handleCreateParticipant()}>
					<Close />
				</IconButton>
			</DialogTitle>

			{initialValues && (
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={async (values, { resetForm }) => {
						setSubmitted(true)

						if (!dataset?.Name || !dataset?.Path) {
							showNotif('Participant not saved', 'error')
							return
						}

						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const { participant_id, ...other } = values as any
						const participant = {
							participant_id: (/^sub-/.test(participant_id) ? participant_id : "sub-" + participant_id),
							...other,
						}

						handleCreateParticipant(participant)
						resetForm()
						setSubmitted(false)
					}}
				>
					{({ errors, handleChange, touched, values, submitForm }) => (
						<Form>
							<DialogContent dividers>
								<Grid container columnSpacing={2} rowSpacing={2}>
									{fields?.map(field => {
										return (
											<Grid item xs={6} key={field}>
												<TextField
													key={field}
													disabled={
														editMode ? field === 'participant_id' : submitted
													}
													size='small'
													fullWidth
													name={field}
													label={field}
													value={(values as IField)[field]}
													onChange={handleChange}
													InputProps={(field === 'participant_id' && !editMode && {
														startAdornment: <InputAdornment position="start">sub-</InputAdornment>,
													}) || {}}
													error={
														// eslint-disable-next-line @typescript-eslint/no-explicit-any
														((touched as any)[field] && (errors as IField)[field])
															? true
															: false
													}
													helperText={
														// eslint-disable-next-line @typescript-eslint/no-explicit-any
														((touched as any)[field] && (errors as IField)[field])
															? (errors as IField)[field]
															: null
													}
												/>
											</Grid>
										)
									})}
								</Grid>
							</DialogContent>

							<DialogActions>
								<LoadingButton
									color='primary'
									onSubmit={submitForm}
									type='submit'
									loading={submitted}
									loadingPosition='start'
									startIcon={<Save />}
									variant='contained'
								>
									Save
								</LoadingButton>
							</DialogActions>
						</Form>
					)}
				</Formik>
			)}
		</Dialog>
	)
}

export default CreateParticipant
