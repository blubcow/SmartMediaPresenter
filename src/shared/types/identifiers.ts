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
}
