import { SinglePresentation } from '../shared/types/presentation';

export interface IPresentationSyncContext {
	storedPresentations: SyncableStoredPresentation[];
	createPresentation: (
		callback: (id: number) => any,
		pres?: SinglePresentation | undefined
	) => void;
	removeSinglePresentation: (id: number) => void;
	retrieveSinglePresentationOnce: (
		id: number,
		callback: (presentation: SinglePresentation) => void
	) => void;
	remoteMedia: RemotelyAvailableMedia;
	localSyncingQueue: LocalSyncPresentationItem[];
	addToLocalSyncingQueue: AddToLocalSyncingQueueHandler;
	syncingAvailable: boolean;
	syncPaper: Map<string, SyncPaperEntry>;
	retrieveRemotePresentationOnce: (
		remoteId: string,
		callback: (presentation: SinglePresentation) => void
	) => void;
	downloadAndUpdateLocalPresentation: (remoteId: string) => void;
	downloadingPresentations: string[];
	getRemoteMedia: (
		callback: (files: RemoteStorageMedia[]) => void,
		path?: string
	) => void;
	createFolder: (
		folderName: string,
		callback: (folder: RemoteStorageMedia) => void,
		path?: string
	) => void;
	deleteFiles: (files: RemoteStorageMedia[], callback: () => void) => void;
}

export type AddToLocalSyncingQueueHandler = (
	presentation: SinglePresentation,
	presentationId: number
) => void;

export interface RemotelyAvailableMedia {
	name: string;
	downloadUrl: string;
}

export interface LocalSyncPresentationItem {
	presentation: SinglePresentation;
	presentationId: number;
}

export type PresentationSyncStatus = 'uploadable' | 'downloadable' | 'insync';

export interface SyncPaperEntry {
	name: string;
	remoteId: string;
	remoteUpdate: number;
}

export interface SyncableStoredPresentation {
	name: string;
	id?: number;
	remoteId?: string;
	created?: number;
	remoteUpdate?: number;
}

export type RemoteStorageMediaType = 'file' | 'dir';

export interface RemoteStorageMedia {
	type: RemoteStorageMediaType;
	name: string;
	path: string;
	url?: string;
}
