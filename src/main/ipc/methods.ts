import {
	app,
	BrowserWindow,
	desktopCapturer,
	dialog,
	IpcMain,
	SaveDialogOptions,
	screen,
} from 'electron';
import { MainProcessMethodIdentifiers } from '../../renderer/shared/types/identifiers';
import * as path from 'path';
import * as fs from 'fs';
import { FileExpolorerOptions } from './types/fileExplorer';
import { FileExplorerType } from '../../renderer/shared/types/fileExplorer';
import { getFonts } from 'font-list';
import { UserSettings } from '../../renderer/shared/types/userSettings';
import {
	SinglePresentation,
	StoredPresentations,
} from '../../renderer/shared/types/presentation';
import { WorkspaceChangeResult } from '../../renderer/shared/types/workspace';
import xlsx from 'xlsx';
import { convertJsonToXlsx } from './models/PresentationFileConverter';
import { getFilesInDir, getFileFromPath } from './models/FileSystem';
import { parse } from './models/PresentationParser';

let globalWorkspace: string | undefined;

export const registerMainProcessMethodHandlers = (
	userDataPath: string,
	ipcMain: IpcMain,
	mainWindow: BrowserWindow
) => {
	const windows: BrowserWindow[] = [mainWindow];
	let presentationModePresentationFile: SinglePresentation | undefined;

	ipcMain.handle(
		MainProcessMethodIdentifiers.setWorkspace,
		async (_, workspace?: string) => {
			globalWorkspace = workspace;

			const storePath = userDataPath + '/store';
			const workspacePath = `${userDataPath}/store/${workspace}`;

			if (!fs.existsSync(storePath)) {
				fs.mkdirSync(storePath);
			}

			const firstLogin =
				workspace !== undefined && !fs.existsSync(workspacePath);

			if (firstLogin) {
				fs.mkdirSync(workspacePath);
			}

			const path = userDataPath + '/store/presentations.json';
			const presentations: any = fs.existsSync(path)
				? JSON.parse(`${fs.readFileSync(path)}`)
				: {
						count: 0,
						presentations: [],
				  };

			const result: WorkspaceChangeResult = {
				localPresentationsImportable:
					presentations.presentations.length > 0 && firstLogin,
				localPresentations: presentations.presentations.length,
			};

			return result;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.importLocalPresentationsIntoWorkspace,
		async () => {
			if (globalWorkspace === undefined) return -1;

			const storePath = userDataPath + '/store';
			const workspacePath = `${userDataPath}/store/${globalWorkspace}`;
			const storeFile = storePath + '/presentations.json';
			const workspaceStoreFile = `${userDataPath}/store/${globalWorkspace}/presentations.json`;

			if (!fs.existsSync(storePath) || !fs.existsSync(storeFile)) return;

			if (!fs.existsSync(workspacePath)) {
				fs.mkdirSync(workspacePath);
			}

			const storeFileJson: StoredPresentations = JSON.parse(
				`${fs.readFileSync(storeFile)}`
			);

			fs.writeFileSync(workspaceStoreFile, JSON.stringify(storeFileJson));

			storeFileJson.presentations.forEach((pres) => {
				const buffer = fs.readFileSync(`${storePath}/${pres.id}.json`);
				const newPres = JSON.parse(`${buffer}`);
				fs.writeFileSync(
					`${workspacePath}/${pres.id}.json`,
					JSON.stringify({
						...newPres,
						remoteId: undefined,
						remoteUpdate: undefined,
					})
				);
			});

			return 0;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.CreatePresentation,
		async (_, pres?: SinglePresentation, created?: number) => {
			if (!fs.existsSync(userDataPath + '/store')) {
				fs.mkdirSync(userDataPath + '/store');
			}

			const path =
				userDataPath +
				'/store' +
				`${globalWorkspace ? '/' + globalWorkspace : ''}`;
			const file = path + '/presentations.json';

			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}

			const presentations: any = fs.existsSync(file)
				? JSON.parse(`${fs.readFileSync(file)}`)
				: {
						count: 0,
						presentations: [],
				  };

			const currentId = presentations.count + 1;
			const presentationName = `presentation-${currentId}`;
			const timestamp = created ?? Date.now();
			const newPresentation: any = {
				id: currentId,
				name: pres?.name ?? presentationName,
				created: timestamp,
				remoteId: pres?.remoteId,
				remoteUpdate: pres?.remoteUpdate,
			};

			fs.writeFileSync(
				file,
				JSON.stringify({
					count: currentId,
					presentations: [...presentations.presentations, newPresentation],
				})
			);

			fs.writeFileSync(
				`${path}/${currentId}.json`,
				JSON.stringify({
					name: presentationName,
					lastChanges: timestamp,
					slides: [],
					...pres,
				})
			);

			return newPresentation;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.GetStoredPresentations,
		async (_) => {
			const path = `${userDataPath}/store${
				globalWorkspace ? '/' + globalWorkspace : ''
			}/presentations.json`;

			const presentations: any = fs.existsSync(path)
				? JSON.parse(`${fs.readFileSync(path)}`)
				: {
						count: 0,
						presentations: [],
				  };

			return presentations;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.GetSinglePresentation,
		async (_, id: number) => {
			if (typeof id !== 'number') {
				return;
			}

			const file = JSON.parse(
				`${fs.readFileSync(
					userDataPath +
						`/store${globalWorkspace ? '/' + globalWorkspace : ''}/${id}.json`
				)}`
			);

			return file;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.deleteSinglePresentation,
		async (_, id) => {
			const path =
				userDataPath +
				`/store${globalWorkspace ? '/' + globalWorkspace : ''}/${id}.json`;
			const audioPath =
				userDataPath +
				`/store${globalWorkspace ? '/' + globalWorkspace : ''}/audio/${id}`;

			if (!fs.existsSync(path)) return;

			fs.unlinkSync(path);

			if (fs.existsSync(audioPath))
				fs.rmdirSync(audioPath, { recursive: true });

			const presentations = JSON.parse(
				`${fs.readFileSync(
					userDataPath +
						`/store${
							globalWorkspace ? '/' + globalWorkspace : ''
						}/presentations.json`
				)}`
			);

			const newPresentations = presentations.presentations.filter(
				(pres: any) => pres.id !== id
			);
			presentations.presentations = newPresentations;

			fs.writeFileSync(
				userDataPath +
					`/store${
						globalWorkspace ? '/' + globalWorkspace : ''
					}/presentations.json`,
				JSON.stringify(presentations)
			);
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.removeRemoteAttributesFromPresentation,
		async (_, id: number) => {
			const path =
				userDataPath +
				`/store${globalWorkspace ? '/' + globalWorkspace : ''}/${id}.json`;
			const pres = JSON.parse(`${fs.readFileSync(path)}`);

			fs.writeFileSync(
				path,
				JSON.stringify({
					...pres,
					remoteId: undefined,
					remoteUpdate: undefined,
				})
			);

			const presentations = JSON.parse(
				`${fs.readFileSync(
					userDataPath +
						`/store${
							globalWorkspace ? '/' + globalWorkspace : ''
						}/presentations.json`
				)}`
			);

			const storedPres = presentations.presentations.find(
				(presentation: any) => presentation.id === id
			);
			const newPres = presentations.presentations.filter(
				(presentation: any) => presentation.id !== id
			);
			storedPres.remoteId = undefined;
			storedPres.remoteUpdate = undefined;

			newPres.push(storedPres);

			presentations.presentations = newPres;

			fs.writeFileSync(
				userDataPath +
					`/store${
						globalWorkspace ? '/' + globalWorkspace : ''
					}/presentations.json`,
				JSON.stringify(presentations)
			);

			return;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.SaveChangesToPresentation,
		async (_, id: number, file: any, remoteTimestamp?: number) => {
			const oldFile = JSON.parse(
				`${fs.readFileSync(
					userDataPath +
						`/store${globalWorkspace ? '/' + globalWorkspace : ''}/${id}.json`
				)}`
			);

			const timestamp = remoteTimestamp ?? Date.now();

			const newFile = { ...oldFile, ...file, lastChanges: timestamp };

			fs.writeFileSync(
				userDataPath +
					`/store${globalWorkspace ? '/' + globalWorkspace : ''}/${id}.json`,
				JSON.stringify(newFile)
			);
			const presentations = JSON.parse(
				`${fs.readFileSync(
					userDataPath +
						`/store${
							globalWorkspace ? '/' + globalWorkspace : ''
						}/presentations.json`
				)}`
			);
			const pres = presentations.presentations.find(
				(presentation: any) => presentation.id === id
			);
			const newPres = presentations.presentations.filter(
				(presentation: any) => presentation.id !== id
			);

			pres.created = timestamp;
			pres.name = file.name ?? pres.name;
			pres.remoteId = file.remoteId;
			pres.remoteUpdate = file.remoteUpdate;

			newPres.push(pres);

			presentations.presentations = newPres;

			fs.writeFileSync(
				userDataPath +
					`/store${
						globalWorkspace ? '/' + globalWorkspace : ''
					}/presentations.json`,
				JSON.stringify(presentations)
			);
			return file;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.LoadFilesFromDirectory,
		async (_, dirPath: string) => {
			return getFilesInDir(dirPath);
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.CreateQuickCreatePresentation,
		async (_, presentationName: string, slides: any[]) => {
			const path =
				userDataPath +
				'/store' +
				`${globalWorkspace ? '/' + globalWorkspace : ''}`;
			const file = path + '/presentations.json';

			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}

			const presentations: any = fs.existsSync(file)
				? JSON.parse(`${fs.readFileSync(file)}`)
				: {
						count: 0,
						presentations: [],
				  };

			const currentId = presentations.count + 1;
			const timestamp = Date.now();
			const newPresentation: any = {
				id: currentId,
				name: presentationName,
				created: timestamp,
			};

			fs.writeFileSync(
				file,
				JSON.stringify({
					count: currentId,
					presentations: [...presentations.presentations, newPresentation],
				})
			);

			fs.writeFileSync(
				`${path}/${currentId}.json`,
				JSON.stringify({
					name: presentationName,
					lastChanges: timestamp,
					slides: slides,
				})
			);

			return newPresentation;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.OpenFileSelectorDialog,
		async (_, type: FileExplorerType) => {
			// TODO: This is selecting a folder, not files!
			const files = dialog.showOpenDialogSync(mainWindow, {
				...FileExpolorerOptions[type],
			});

			if (!files || !files.length) return [];

			const returnArray = files.reduce<any[]>(
				(prev, file) => {
					const arr = path.extname(file) === ''
						? [...prev, ...getFilesInDir(file)]
						: [...prev, getFileFromPath(file)];
					return arr;
				},
				[]
			);

			return returnArray;
		}
	);

	ipcMain.handle(MainProcessMethodIdentifiers.DisplaysAvailable, async () => {
		return await screen.getAllDisplays().length;
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.StartPresenterMode,
		async (
			_,
			startingSlide: number,
			id?: number,
			remoteId?: string,
			displayNumber?: number,
			presentationFile?: SinglePresentation
		) => {
			if ((await screen.getAllDisplays().length) === 1) return;

			presentationModePresentationFile = presentationFile;

			const currentScreenOfMainWindow = screen.getDisplayNearestPoint(
				mainWindow.getBounds()
			);
            
            const displayIndex = (displayNumber && displayNumber > 1) ? displayNumber - 1 : 0;
			const display = screen
				.getAllDisplays()
				.filter((disp) => disp.id !== currentScreenOfMainWindow.id)[displayIndex];
			

			// TODO: fix this bug
			alert('Second window not working yet...');
			return;
			

			const presentation = new BrowserWindow({
				x: display.bounds.x + 50,
				y: display.bounds.y + 50,
				fullscreen: true,
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false,
					webSecurity: app.isPackaged,
				},
				autoHideMenuBar: true,
			});

			const location = app.isPackaged
				? `file://${path.join(__dirname, '../index.html')}`
				: 'http://localhost:3000';

			presentation.loadURL(
				`${location}#/pres?startingSlide=${startingSlide}${
					id !== undefined ? '&id=' + id : ''
				}${remoteId !== undefined ? '&remoteId=' + remoteId : ''}`
			);
			presentation.maximize();
			presentation.setFullScreen(true);
			windows.push(presentation);
			setTimeout(() => {
				mainWindow.focus();
			}, 2500);
		}
	);

	ipcMain.handle(MainProcessMethodIdentifiers.EndPresenterMode, async () => {
		if (windows.length === 1) return;
		const w = windows.pop();
		presentationModePresentationFile = undefined;
		if(w) w.close();
	});

	ipcMain.handle(MainProcessMethodIdentifiers.NextSlideTrigger, async () => {
		windows.forEach((win) =>
			win.webContents.send(
				MainProcessMethodIdentifiers.PresenterModeUpdateNotification,
				1
			)
		);
		return;
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.presentationModePresentationFileReceived,
		async () => {
			return presentationModePresentationFile;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.PreviousSlideTrigger,
		async () => {
			windows.forEach((win) =>
				win.webContents.send(
					MainProcessMethodIdentifiers.PresenterModeUpdateNotification,
					-1
				)
			);
			return;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.quickJumpSlidesPresentationMode,
		async (_, jump: number) => {
			windows.forEach((win) =>
				win.webContents.send(
					MainProcessMethodIdentifiers.PresenterModeUpdateNotification,
					jump
				)
			);
			return;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.storeAudioFile,
		async (_, id: number, buffer: Buffer) => {
			const path = `${userDataPath}/store${
				globalWorkspace ? '/' + globalWorkspace : ''
			}/audio`;
			const presPath = `/${id}`;
			const fileName = `/${Date.now()}.webm`;

			if (!fs.existsSync(path)) {
				await fs.mkdirSync(path);
			}

			if (!fs.existsSync(path + presPath)) {
				await fs.mkdirSync(path + presPath);
			}

			await fs.writeFileSync(path + presPath + fileName, buffer);

			return path + presPath + fileName;
		}
	);

	ipcMain.handle(MainProcessMethodIdentifiers.getSystemFonts, async () => {
		return await getFonts();
	});

	ipcMain.handle(MainProcessMethodIdentifiers.getUserSettings, async () => {
		const file =
			userDataPath +
			`/store${globalWorkspace ? '/' + globalWorkspace : ''}/userSettings.json`;
		return fs.existsSync(file)
			? JSON.parse(`${fs.readFileSync(file)}`)
			: { language: 'auto', theme: 'auto' };
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.saveUserSettings,
		async (_, settings: UserSettings) => {
			const path =
				userDataPath +
				'/store' +
				`${globalWorkspace ? '/' + globalWorkspace : ''}`;

			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}

			fs.writeFileSync(path + '/userSettings.json', JSON.stringify(settings));
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.openSavePresentationDialog,
		async (_, title: string, presentation: SinglePresentation) => {
			const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
				...(FileExpolorerOptions.save as SaveDialogOptions),
				title: title,
				defaultPath: presentation.name,
			});

			if (!canceled && filePath !== undefined) {
				const fileExtension = filePath.split('.').reverse()[0];
				const fileName = filePath.split('/').reverse()[0].split('.')[0];

				if (fileExtension === 'json') {
					fs.writeFileSync(
						filePath,
						JSON.stringify({
							...presentation,
							name: fileName,
							remoteId: undefined,
							remoteUpdate: undefined,
						})
					);
				} else if (fileExtension === 'xlsx') {
					const book = convertJsonToXlsx({ ...presentation, name: fileName });
					xlsx.writeFile(book, filePath);
				}
			}
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.importPresentationFromFS,
		async (_, path: string) => {
			const fileExtension:string = path.split('.').reverse()[0];
			
			// TODO: Check what happens to "throw Error in Electron"
			const fileParser = parse.get(fileExtension)
			if(!fileParser){
				throw new Error('PresentationParser can not show extension ' + fileExtension);
			}
			const file = fileParser(path);

			return file;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.retriveFullFile,
		async (_, path: string) => {
			return fs.readFileSync(path);
		}
	);

	ipcMain.handle(
		'getCurrentWindowMediaSourceId',
		async (_) => {
			/*
			This does not work because of bug in electron !!
			const inputSources = await desktopCapturer.getSources({
				types: ['window', 'screen']
			});
			*/
			const windowSourceId = mainWindow.getMediaSourceId();
			return windowSourceId;
		}
	);

	// Mainly used for debugging buffer file output
	ipcMain.handle(
		'saveBufferToFile',
		async (_, buffer: Buffer) => {
			const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
				title:'saveBufferToFile'
			})
			if (!canceled && filePath !== undefined) {
				fs.writeFileSync(filePath, buffer);
			}
		}
	);
};
