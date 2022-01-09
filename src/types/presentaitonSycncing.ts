import {
	SinglePresentation,
	StoredPresentation,
	StoredPresentations,
} from '../shared/types/presentation';

export interface IPresentationSyncContext {
	storedPresentations: StoredPresentation[];
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
	syncPaper: Map<string, number>;
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
