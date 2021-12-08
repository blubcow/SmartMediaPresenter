import { useState, useEffect } from 'react';
import { FileExplorerType } from '../shared/types/fileExplorer';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import {
	StoredPresentation,
	StoredPresentations,
	SinglePresentation,
	Slide,
} from '../shared/types/presentation';
const { ipcRenderer } = window.require('electron');

export const useStoredPresentations = () => {
	const [presentations, setPresentations] = useState<StoredPresentation[]>([]);

	useEffect(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetStoredPresentations)
			.then((r: StoredPresentations) => {
				// sorts the presentations so that the last changes are on top
				r.presentations.sort((f, s) => (f.created < s.created ? 1 : -1));
				setPresentations([...r.presentations]);
			});
	}, []);

	const retrieveSinglePresentationOnce = (
		id: number,
		callback: (presentation: SinglePresentation) => void
	) => {
		if (isNaN(id)) return;
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetSinglePresentation, id)
			.then((r: SinglePresentation) => {
				callback(r);
			});
	};

	const createPresentation = (callback: (id: number) => any) => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.CreatePresentation)
			.then((r: StoredPresentation) => {
				setPresentations([...presentations, r]);
				callback(r.id);
			});
	};

	const createQuickCreatePresentation = (
		name: string,
		slides: Slide[],
		callback: (id: number) => any
	) => {
		ipcRenderer
			.invoke(
				MainProcessMethodIdentifiers.CreateQuickCreatePresentation,
				name,
				slides
			)
			.then((r: StoredPresentation) => {
				setPresentations([...presentations, r]);
				callback(r.id);
			});
	};

	return {
		retrieveSinglePresentationOnce,
		createPresentation,
		createQuickCreatePresentation,
		presentations,
	};
};

export const useSinglePresentation = (id: number) => {
	const [presentationId, setId] = useState<number>(id);
	const [storedPresentation, setStroedPresentation] =
		useState<SinglePresentation>();

	useEffect(() => {
		if (isNaN(id)) {
			return;
		}
		setId(id);
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetSinglePresentation, id)
			.then((r: SinglePresentation) => {
				setStroedPresentation(r);
			});
	}, [id]);

	const saveChanges = (file: Partial<SinglePresentation>) => {
		ipcRenderer
			.invoke(
				MainProcessMethodIdentifiers.SaveChangesToPresentation,
				presentationId,
				file
			)
			.then((r: SinglePresentation) => {
				setStroedPresentation(r);
			});
	};

	return { storedPresentation, saveChanges };
};

export const useLocalFileSystem = () => {
	const getFilesInDir = async (path: string) => {
		const filesInDir = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.LoadFilesFromDirectory,
			path
		);
		return filesInDir;
	};

	const openFileSelectorDialog = async (type: FileExplorerType) => {
		const files = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.OpenFileSelectorDialog,
			type
		);
		return files;
	};

	return { getFilesInDir, openFileSelectorDialog };
};

export const useDisplays = () => {
	const displaysAvailable = async () => {
		return await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.DisplaysAvailable
		);
	};

	const startPresentationMode = async (id: number, display?: number) => {
		ipcRenderer.invoke(
			MainProcessMethodIdentifiers.StartPresenterMode,
			id,
			display
		);
	};

	return { displaysAvailable, startPresentationMode };
};

export const usePresentationMode = () => {
	const [slideNumber, setSlide] = useState<number>(0);
	const [nextSlide] = useState<() => void>(() => () => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.NextSlideTrigger);
	});
	const [previousSlide] = useState<() => void>(() => () => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.PreviousSlideTrigger);
	});

	useEffect(() => {
		ipcRenderer.on(
			MainProcessMethodIdentifiers.PresenterModeUpdateNotification,
			(event: any, slide: number) => {
				setSlide((curr) => curr + slide);
			}
		);
		return () => {
			ipcRenderer.removeAllListeners();
		};
	}, []);

	const terminatePresentationMode = () => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.EndPresenterMode);
	};

	return {
		slideNumber,
		nextSlide,
		previousSlide,
		terminatePresentationMode,
	};
};

export const useAudioStore = () => {
	const storeAudio = async (id: number, buffer: Buffer) => {
		const path = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.storeAudioFile,
			id,
			buffer
		);
		return path;
	};

	return { storeAudio };
};
