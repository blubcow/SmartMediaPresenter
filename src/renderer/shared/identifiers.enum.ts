export enum MainProcessMethodIdentifiers {
	CreatePresentation = 'createPresentation',
	LoadFilesFromDirectory = 'loadFilesFromDirectory',
	GetStoredPresentations = 'getStoredPresentations',
	GetSinglePresentation = 'getSinglePresentation',
	deleteSinglePresentation = 'deleteSinglePresentation',
	SaveChangesToPresentation = 'saveChangesToPresentation',
	CreateQuickCreatePresentation = 'createPresentationQuickCreate',
	OpenFileSelectorDialog = 'openFileSelectorDialog',
	DisplaysAvailable = 'displaysAvailable',
	StartPresenterMode = 'startPresenterMode',
	NextSlideTrigger = 'nextSlideTrigger',
	PreviousSlideTrigger = 'previousSlideTrigger',
	PresenterModeUpdateNotification = 'presenterModeUpdate',
	EndPresenterMode = 'endPresenterMode',
	storeAudioFile = 'storeAudioFile',
	getSystemFonts = 'getSystemFonts',
	getUserSettings = 'getUserSettings',
	saveUserSettings = 'saveUserSettings',
	openSavePresentationDialog = 'openSavePresentationDialog',
	importPresentationFromFS = 'importPresentationFromFS',
	retriveFullFile = 'retrieveFullFile',
	setWorkspace = 'setWorkspace',
	importLocalPresentationsIntoWorkspace = 'importLocalPresentationsIntoWorkspace',
	removeRemoteAttributesFromPresentation = 'removeRemoteAttributesFromPresentation',
	quickJumpSlidesPresentationMode = 'quickJumpSlidesPresentationMode',
	presentationModePresentationFileReceived = 'presentationModePresentationFileReceived',
}


export enum DataTransferIdentifiers {
	MediaFileInfo = 'mediaFileInfo',
	MultipleMediaFileInfo = 'mulitipleMediaFileInfo',
	RemoteMediaFileInfo = 'remoteMediaFileInfo',
	MulitpleRemoteMediaFileInfo = 'mulitpleRemoteMediaFileInfo',
}

export enum PresentationEditingActionIdentifiers {
	editingMediaStarted = 'ems',
	editingSlideStated = 'ess',
	editingPresentationFrameStarted = 'epfs',
	editingTextStarted = 'ets',
	changeCurrentSlide = 'ccs',
	presentationSettingsUpdated = 'psu',
	editingBoxDimensionsUpdated = 'ebdu',
	presentationFrameUpdated = 'pfu',
	savePresentationChanges = 'spc',
	lastFontChanged = 'lfc',

	selectSecondMedia ='ssm',
	abortSelectSecondMedia = 'assm',
}
