import { API_GATEWAY, catchError, checkForError } from './gatewayClientAPI'

import {
	BIDSDataset,
	BIDSDatasetResponse,
	BIDSSubjectFile,
	CreateBidsDatasetDto,
	CreateSubjectDto,
	EditSubjectClinicalDto,
	CreateBidsDatasetParticipantsTsvDto,
	IError,
	Participant,
	BIDSDatasetsQueryResponse,
} from './types'

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


// {
// 	"subjects": [
// 		{
// 			"sub": "01",
// 			"age": "25",
// 			"sex": "M",
// 			"hospital": "CHUV"
// 		}
// 	]
// }

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

export const getSubject = async (
	path: string,
	userId: string,
	subject: string
): Promise<BIDSSubjectFile[]> => {
	const url = `${API_GATEWAY}/tools/bids/subject?path=${path}&owner=${userId}&sub=${subject}`
	return fetch(url, {
		headers: {
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const importSubject = async (
	createSubject: CreateSubjectDto
): Promise<CreateSubjectDto> => {
	const url = `${API_GATEWAY}/tools/bids/subject`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(createSubject),
	})
		.then(checkForError)
		.catch(catchError)
}

export const subEditClinical = async (
	editSubject: EditSubjectClinicalDto
): Promise<EditSubjectClinicalDto> =>
	await fetch(`${API_GATEWAY}/tools/bids/subject`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(editSubject),
	})
		.then(checkForError)
		.catch(catchError)
