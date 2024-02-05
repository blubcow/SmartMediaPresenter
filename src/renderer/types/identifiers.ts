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
	abortSelectSecondMedia = 'assm'
}
