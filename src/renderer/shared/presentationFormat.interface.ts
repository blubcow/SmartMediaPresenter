export const PresentationFileAvailableExtensions = ['json', 'xlsx'] as const;

export type PresentationFormatFileType =
	typeof PresentationFileAvailableExtensions[number];
