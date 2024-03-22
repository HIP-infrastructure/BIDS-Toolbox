import { Node, TreeNode, User } from './types'
import {
	BIDSDataset,
	BIDSDatasetResponse,
	BIDSSubjectFile,
	CreateBidsDatasetDto,
	EditSubjectClinicalDto,
	CreateBidsDatasetParticipantsTsvDto,
	IError,
	Participant,
	BIDSDatasetsQueryResponse,
	BIDSFile,
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
	const url = `${API_GATEWAY}/datasets/${name}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(checkForError)
		.catch(catchError)
}

export const publishDatasetToPublicSpace = async (path: string) => {
	const url = `${API_GATEWAY}/tools/bids/datasets/publish?path=${path}`
	fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const refreshBidsDatasetsIndex = async (
	owner?: string
): Promise<BIDSDataset[]> => {
	const url = `${API_GATEWAY}/tools/bids/datasets/refresh_index?owner=${owner}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const indexBidsDataset = async (
	owner?: string,
	path?: string
): Promise<BIDSDataset> => {
	const url = `${API_GATEWAY}/tools/bids/dataset/index?owner=${owner}&path=${path}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const deleteBidsDataset = async (
	owner?: string,
	path?: string
): Promise<BIDSDataset> => {
	const url = `${API_GATEWAY}/tools/bids/dataset/delete?owner=${owner}&path=${path}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
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
	CreateBidsDatasetDto: CreateBidsDatasetDto
): Promise<BIDSDatasetResponse | IError> => {
	const url = `${API_GATEWAY}/datasets`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(CreateBidsDatasetDto),
	})
		.then(checkForError)
		.catch(catchError)
}

export const createParticipant = async (datasetName: string, participant: Participant) => {
	const url = `${API_GATEWAY}/datasets/${datasetName}/participants`
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

export const getParticipants = async (
	path: string,
	userId: string
): Promise<Participant[]> => {
	const url = `${API_GATEWAY}/tools/bids/participants?path=${path}&owner=${userId}`
	return fetch(url, {
		headers: {},
	})
		.then(checkForError)
		.catch(catchError)
}

export const writeParticipantsTSV = async (
	userId: string | undefined,
	datasetPath: string,
	createBidsDatasetParticipantsTsvDto: CreateBidsDatasetParticipantsTsvDto
): Promise<void> => {
	const url = `${API_GATEWAY}/tools/bids/dataset/write_participants_tsv?owner=${userId}&datasetPath=${datasetPath}`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(createBidsDatasetParticipantsTsvDto),
	})
		.then(checkForError)
		.catch(catchError)
}

// export const getSubject = async (
// 	path: string,
// 	userId: string,
// 	subject: string
// ): Promise<BIDSSubjectFile[]> => {
// 	const url = `${API_GATEWAY}/tools/bids/subject?path=${path}&owner=${userId}&sub=${subject}`
// 	return fetch(url, {
// 		headers: {
// 		},
// 	})
// 		.then(checkForError)
// 		.catch(catchError)
// }

export const importSubject = async (
	datasetName: string,
	files: BIDSFile[]
): Promise<any> => {
	const url = `${API_GATEWAY}/datasets/${datasetName}/files`
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

// export const subEditClinical = async (
// 	editSubject: EditSubjectClinicalDto
// ): Promise<EditSubjectClinicalDto> =>
// 	await fetch(`${API_GATEWAY}/tools/bids/subject`, {
// 		method: 'PATCH',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(editSubject),
// 	})
// 		.then(checkForError)
// 		.catch(catchError)

