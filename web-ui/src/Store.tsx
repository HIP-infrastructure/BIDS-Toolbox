import React, { useState } from 'react'
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
	const [selectedBidsDataset, setSelectedBidsDataset] = useState<BIDSDataset>()
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [selectedFiles, setSelectedFiles] = useState<BIDSFile[]>()

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			tooltips: [showTooltip, setShowTooltip],
			selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
			selectedParticipants: [selectedParticipants, setSelectedParticipants],
			selectedFiles: [selectedFiles, setSelectedFiles],
		}),
		[
			debug,
			setDebug,
			showTooltip,
			setShowTooltip,
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
