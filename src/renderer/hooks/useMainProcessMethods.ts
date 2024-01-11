import { useState, useEffect, useCallback } from 'react';
import { FileExplorerType } from '../shared/types/fileExplorer';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import {
	StoredPresentation,
	StoredPresentations,
	SinglePresentation,
	Slide,
} from '../shared/types/presentation';
import { UserSettings } from '../shared/types/userSettings';
import { WorkspaceChangeResult } from '../shared/types/workspace';

const ipcRenderer = window.electron;

export const useStoredPresentations = () => {
	const [presentations, setPresentations] = useState<StoredPresentation[]>([]);

	const loadPresentations = useCallback(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetStoredPresentations)
			.then((r: StoredPresentations) => {
				// sorts the presentations so that the ones with the most recent changes are on top
				r.presentations.sort((f, s) => (f.created < s.created ? 1 : -1));
				setPresentations([...r.presentations]);
			});
	}, [ipcRenderer]);

	useEffect(() => {
		loadPresentations();
	}, []);

	const retrieveSinglePresentationOnce = useCallback(
		(id: number, callback: (presentation: SinglePresentation) => void) => {
			if (isNaN(id)) return;
			ipcRenderer
				.invoke(MainProcessMethodIdentifiers.GetSinglePresentation, id)
				.then((r: SinglePresentation) => {
					callback(r);
				});
		},
		[ipcRenderer]
	);

	const createPresentation = useCallback(
		(
			callback: (id: number) => any,
			pres?: SinglePresentation,
			created?: number
		) => {
			ipcRenderer
				.invoke(MainProcessMethodIdentifiers.CreatePresentation, pres, created)
				.then((r: StoredPresentation) => {
					setPresentations([...presentations, r]);
					callback(r.id);
				});
		},
		[ipcRenderer, presentations]
	);

	const createQuickCreatePresentation = useCallback(
		(name: string, slides: Slide[], callback: (id: number) => any) => {
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
		},
		[ipcRenderer, presentations]
	);

	const removeSinglePresentation = useCallback(
		(id: number) => {
			ipcRenderer.invoke(
				MainProcessMethodIdentifiers.deleteSinglePresentation,
				id
			);
			const filteredPres = [...presentations].filter((pres) => {
				return pres.id !== id;
			});
			setPresentations(filteredPres);
		},
		[ipcRenderer, setPresentations, presentations]
	);

	const removeRemoteAttributesFromPresentation = useCallback(
		(id: number) => {
			ipcRenderer.invoke(
				MainProcessMethodIdentifiers.removeRemoteAttributesFromPresentation,
				id
			);
		},
		[ipcRenderer]
	);

	return {
		retrieveSinglePresentationOnce,
		createPresentation,
		createQuickCreatePresentation,
		presentations,
		removeSinglePresentation,
		reloadPresentations: loadPresentations,
		removeRemoteAttributesFromPresentation,
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

	const saveChanges = useCallback(
		(file: Partial<SinglePresentation>) => {
			ipcRenderer
				.invoke(
					MainProcessMethodIdentifiers.SaveChangesToPresentation,
					presentationId,
					file
				)
				.then((r: SinglePresentation) => {
					setStroedPresentation(r);
				});
		},
		[ipcRenderer, setStroedPresentation, presentationId]
	);

	return { storedPresentation, saveChanges };
};

export const useLocalFileSystem = () => {
	const getFilesInDir = useCallback(
		async (path: string) => {
			const filesInDir = await ipcRenderer.invoke(
				MainProcessMethodIdentifiers.LoadFilesFromDirectory,
				path
			);
			return filesInDir;
		},
		[ipcRenderer]
	);

	const openFileSelectorDialog = useCallback(
		async (type: FileExplorerType) => {
			const files = await ipcRenderer.invoke(
				MainProcessMethodIdentifiers.OpenFileSelectorDialog,
				type
			);
			return files;
		},
		[ipcRenderer]
	);

	const openSaveFileDialog = useCallback(
		async (title: string, presentation: SinglePresentation) => {
			ipcRenderer.invoke(
				MainProcessMethodIdentifiers.openSavePresentationDialog,
				title,
				presentation
			);
		},
		[ipcRenderer]
	);

	const importPresentationFromFileSystem = useCallback(
		async (path: string) => {
			const pres = (await ipcRenderer.invoke(
				MainProcessMethodIdentifiers.importPresentationFromFS,
				path
			)) as SinglePresentation;
			return pres;
		},
		[ipcRenderer]
	);

	const retriveFullFile = useCallback(
		async (path: string) => {
			return await ipcRenderer.invoke(
				MainProcessMethodIdentifiers.retriveFullFile,
				path
			);
		},
		[ipcRenderer]
	);

	return {
		getFilesInDir,
		openFileSelectorDialog,
		openSaveFileDialog,
		importPresentationFromFileSystem,
		retriveFullFile,
	};
};

export const useDisplays = () => {
	const displaysAvailable = useCallback(async () => {
		return await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.DisplaysAvailable
		);
	}, [ipcRenderer]);

	const startPresentationMode = useCallback(
		async (
			slide: number,
			id?: number,
			remoteId?: string,
			display?: number,
			presentation?: SinglePresentation
		) => {
			ipcRenderer.invoke(
				MainProcessMethodIdentifiers.StartPresenterMode,
				slide,
				id,
				remoteId,
				display,
				presentation
			);
		},
		[ipcRenderer]
	);

	return { displaysAvailable, startPresentationMode };
};

export const usePresentationMode = (startingSlide: number) => {
	const [slideNumber, setSlide] = useState<number>(startingSlide);
	const [presentationFile, setPresentationFile] = useState<
		SinglePresentation | undefined
	>();

	useEffect(() => {
		ipcRenderer.on(
			MainProcessMethodIdentifiers.PresenterModeUpdateNotification,
			async (_: any, slide: number) => {
				setSlide((curr) => curr + slide);
			}
		);
		return () => {
			// TODO: Reverse this hide!
			ipcRenderer.removeAllListeners(MainProcessMethodIdentifiers.PresenterModeUpdateNotification);
		};
	}, []);

	const nextSlide = useCallback(() => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.NextSlideTrigger);
	}, [ipcRenderer]);

	const previousSlide = useCallback(() => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.PreviousSlideTrigger);
	}, [ipcRenderer]);

	const quickJump = useCallback(
		(jump: number) => {
			ipcRenderer.invoke(
				MainProcessMethodIdentifiers.quickJumpSlidesPresentationMode,
				jump
			);
		},
		[ipcRenderer]
	);

	const retrievePresentationFile = useCallback(() => {
		ipcRenderer
			.invoke(
				MainProcessMethodIdentifiers.presentationModePresentationFileReceived
			)
			.then((r?: SinglePresentation) => {
				setPresentationFile(r);
			});
	}, [ipcRenderer]);

	const terminatePresentationMode = useCallback(() => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.EndPresenterMode);
	}, [ipcRenderer]);

	return {
		slideNumber,
		presentationFile,
		retrievePresentationFile,
		nextSlide,
		quickJump,
		previousSlide,
		terminatePresentationMode,
	};
};

export const useAudioStore = () => {
	const storeAudio = useCallback(
		async (id: number, buffer: Buffer) => {
			const path = await ipcRenderer.invoke(
				MainProcessMethodIdentifiers.storeAudioFile,
				id,
				buffer
			);
			return path;
		},
		[ipcRenderer]
	);

	return { storeAudio };
};

export const useSystemFonts = () => {
	const [fonts, setFonts] = useState<string[]>([]);
	useEffect(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.getSystemFonts)
			.then((fonts: string[]) => setFonts(fonts));
	}, []);

	return { fonts };
};

export const useUserSettings = () => {
	const [userSettings, setUserSettings] = useState<UserSettings>({
		theme: 'auto',
		language: 'auto',
	});

	useEffect(() => {
		reloadUserSettings();
	}, []);

	const saveUserSettings = useCallback(
		(settings: UserSettings) => {
			ipcRenderer.invoke(
				MainProcessMethodIdentifiers.saveUserSettings,
				settings
			);
			setUserSettings(settings);
		},
		[ipcRenderer, setUserSettings]
	);

	const reloadUserSettings = useCallback(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.getUserSettings)
			.then((r: UserSettings) => setUserSettings(r));
	}, [ipcRenderer, setUserSettings]);

	return { userSettings, saveUserSettings, reloadUserSettings };
};

export const useWorkspace = () => {
	const changeCurrentWorkspace = useCallback(
		async (
			callback: (canImportLocalPresentations: boolean, amnt: number) => void,
			workspace?: string
		) => {
			ipcRenderer
				.invoke(MainProcessMethodIdentifiers.setWorkspace, workspace)
				.then((result: WorkspaceChangeResult) => {
					callback(
						result.localPresentationsImportable,
						result.localPresentations
					);
				});
		},
		[ipcRenderer]
	);

	const importLocalPresentations = useCallback(
		async (callback: () => void) => {
			ipcRenderer
				.invoke(
					MainProcessMethodIdentifiers.importLocalPresentationsIntoWorkspace
				)
				.then((_: any) => callback());
		},
		[ipcRenderer]
	);

	return { changeCurrentWorkspace, importLocalPresentations };
};
