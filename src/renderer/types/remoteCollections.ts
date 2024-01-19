export const defaultDBURL =
	'https://smart-media-presenter-default-rtdb.europe-west1.firebasedatabase.app' as const;

export enum dbCollection {
	presentations = 'presentations',
	syncPaper = 'syncPaper',
}
