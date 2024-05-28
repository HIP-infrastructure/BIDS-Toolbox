import {
	BIDSDataset,
	BIDSDatasetResponse, BIDSFile,
	IError, Node, Participant
} from './types'

const API_GATEWAY = process.env.REACT_APP_GATEWAY_API
	? `${process.env.REACT_APP_GATEWAY_API}`
	: `${window.location.protocol}//${window.location.host}`

/* Checking the response from the server.
 * server response can have two types of errors:
 * 1) server errors with status (4xx to 5xx) and
 * 2) data processing errors, as { data, error }
 */
const checkForError = async (response: Response) => {
	try {
		const isJson = response.headers
			.get('content-type')
			?.includes('application/json')
		const data = isJson ? await response.json() : response.text()

		if (data?.error) return Promise.reject(data.error.message || data.error)

		return data
	} catch (error) {
		catchError(error)
	}
}

const catchError = (error: unknown) => {
	if (error instanceof Error) return Promise.reject(error.message)
	return Promise.reject(String(error))
}

export const getFiles2 = async (path: string): Promise<Node[]> =>
	fetch(`${API_GATEWAY}/files?path=${encodeURIComponent(path)}`, {
		headers: {
		},
	})
		.then(checkForError)
		.catch(catchError)

export const search = async (term: string) =>
	fetch(`${API_GATEWAY}/files/search/${term}`, {
		headers: {
		},
	})
		.then(checkForError)
		.catch(catchError)

export const fileContent = async (path: string) =>
	fetch(`${API_GATEWAY}/files/content?path=${encodeURIComponent(path)}`, {
		headers: {
		},
	})
		.then(checkForError)
		.catch(catchError)


export const getBidsDataset = async (name: string): Promise<BIDSDataset | undefined> => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(name)}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(checkForError)
		.catch(catchError)
}

export const getAllBidsDataset: () => Promise<BIDSDataset[] | undefined> = async () => {
	const url = `${API_GATEWAY}/datasets`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(checkForError)
		.catch(catchError)
}

export const createBidsDataset = async (
	bidsDataset: BIDSDataset
): Promise<BIDSDatasetResponse | IError> => {
	const url = `${API_GATEWAY}/datasets`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bidsDataset),
	})
		.then(checkForError)
		.catch(catchError)
}

export const editBidsDataset = async (
	previousDatasetName: string,
	CreateBidsDatasetDto: BIDSDataset
): Promise<BIDSDatasetResponse | IError> => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(previousDatasetName)}`
	return fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(CreateBidsDatasetDto),
	})
		.then(checkForError)
		.catch(catchError)
}

export const deleteBidsDataset = async (
	name: string
): Promise<BIDSDatasetResponse | IError> => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(name)}`
	return fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const createParticipant = async (datasetName: string, participant: Participant) => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(datasetName)}/participants`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(participant),
	})
		.then(checkForError)
		.catch(catchError)
}

export const editParticipant = async (datasetName: string, participantName: string, participant: Participant) => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(datasetName)}/participants/${encodeURIComponent(participantName)}`
	return fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(participant),
	})
		.then(checkForError)
		.catch(catchError)
}

export const deleteParticipant = async (datasetName: string, participantId: string) => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(datasetName)}/participants/${encodeURIComponent(participantId)}`
	return fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const createNewParticipantColumn = async (datasetName: string, name: string) => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(datasetName)}/participants/key`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name }),
	})
		.then(checkForError)
		.catch(catchError)
}	

export const deleteParticipantColumn = async (datasetName: string, name: string) => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(datasetName)}/participants/key/${encodeURIComponent(name)}`
	return fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(checkForError)
		.catch(catchError)
}	

export const getParticipants = async (
	path: string,
	userId: string
): Promise<Participant[]> => {
	const url = `${API_GATEWAY}/tools/bids/participants?path=${encodeURIComponent(path)}&owner=${encodeURIComponent(userId)}`
	return fetch(url, {
		headers: {},
	})
		.then(checkForError)
		.catch(catchError)
}


export const importSubject = async (
	datasetName: string,
	files: BIDSFile[]
): Promise<void> => {
	const url = `${API_GATEWAY}/datasets/${encodeURIComponent(datasetName)}/files`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(files),
	})
		.then(checkForError)
		.catch(catchError)
}
