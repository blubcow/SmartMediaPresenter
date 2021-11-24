export enum MainProcessMethodIdentifiers {
	CreatePresentation = 'createPresentation',
	LoadFilesFromDirectory = 'loadFilesFromDirectory',
	GetStoredPresentations = 'getStoredPresentations',
	GetSinglePresentation = 'getSinglePresentation',
	SaveChangesToPresentation = 'saveChangesToPresentation',
	CreateQuickCreatePresentation = 'createPresentationQuickCreate',
	OpenFileSelectorDialog = 'openFileSelectorDialog',
	DisplaysAvailable = 'displaysAvailable',
	StartPresenterMode = 'startPresenterMode',
	NextSlideTrigger = 'nextSlideTrigger',
	PreviousSlideTrigger = 'previousSlideTrigger',
	PresenterModeUpdateNotification = 'presenterModeUpdate',
	EndPresenterMode = 'endPresenterMode',
}

export enum DataTransferIdentifiers {
	MediaFileInfo = 'mediaFileInfo',
	MultipleMediaFileInfo = 'mulitipleMediaFileInfo',
}
