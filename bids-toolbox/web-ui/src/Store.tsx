import { getCurrentUser } from './nextcloudAuth'
import React, { useState } from 'react'
import { refreshBidsDatasetsIndex } from './api/bids'
import { getUsers } from './api/gatewayClientAPI'
import {
	BIDSDataset,
	BIDSFile,
	Participant,
	User,
	UserCredentials,
} from './api/types'


export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	tooltips: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	]
	users: [User[] | null, React.Dispatch<React.SetStateAction<User[] | null>>]
	
	selectedBidsDataset: [
		BIDSDataset | undefined,
		React.Dispatch<React.SetStateAction<BIDSDataset | undefined>>
	]
	selectedParticipants: [
		Participant[] | undefined,
		React.Dispatch<React.SetStateAction<Participant[] | undefined>>
	]
	selectedFiles: [
		BIDSFile[] | undefined,
		React.Dispatch<React.SetStateAction<BIDSFile[] | undefined>>
	]
}

export const AppContext = React.createContext<IAppState>({} as IAppState)

// Provide state for the HIP app
export const AppStoreProvider = ({
	children,
}: {
	children: JSX.Element
}): JSX.Element => {
	const [debug, setDebug] = useState(false)
	const [showTooltip, setShowTooltip] = React.useState(false)
	
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [users, setUsers] = useState<User[] | null>(null)

	// BIDS Tools Store, to be renamed or refactored into a new type
	const [selectedBidsDataset, setSelectedBidsDataset] = useState<BIDSDataset>()
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [selectedFiles, setSelectedFiles] = useState<BIDSFile[]>()

	// Fetch initial data
	React.useEffect(() => {
		const currentUser = getCurrentUser()
		if (!currentUser) return

		setUser(currentUser)
		// getUser(currentUser.uid)
		// 	.then(data => {
		// 		if (data) {
		// 			setUser({
		// 				...currentUser,
		// 				...data,
		// 			})
		// 		}
		// 	})
		// 	.catch(error => {
		// 		console.error(error) // eslint-disable-line no-console
		// 	})
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			tooltips: [showTooltip, setShowTooltip],
			user: [user, setUser],
			users: [users, setUsers],
			selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
			selectedParticipants: [selectedParticipants, setSelectedParticipants],
			selectedFiles: [selectedFiles, setSelectedFiles],
		}),
		[
			debug,
			setDebug,
			showTooltip,
			setShowTooltip,
			users,
			setUsers,
			user,
			setUser,
			selectedBidsDataset,
			setSelectedBidsDataset,
			selectedParticipants,
			setSelectedParticipants,
			selectedFiles,
			setSelectedFiles,
		]
	)

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppStore = (): IAppState => {
	const context = React.useContext(AppContext)
	if (!context) {
		throw new Error('Wrap AppProvider!')
	}

	return context
}
