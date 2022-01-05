import {
	BrowserWindow,
	dialog,
	IpcMain,
	SaveDialogOptions,
	screen,
} from 'electron';
import { MainProcessMethodIdentifiers } from '../src/shared/types/identifiers';
import * as path from 'path';
import * as fs from 'fs';
import { FileExpolorerOptions } from './types/fileExplorer';
import { FileExplorerType } from '../src/shared/types/fileExplorer';
import { getFonts } from 'font-list';
import { UserSettings } from '../src/shared/types/userSettings';
import { SinglePresentation } from '../src/shared/types/presentation';
import xlsx from 'xlsx';
import { convertJsonToXlsx } from './models/PresentationFileConverter';
import { getFilesInDir, getFileFromPath } from './models/FileSystem';
import { parse } from './models/PresentationParser';
import { electron } from 'process';

export const registerMainProcessMethodHandlers = (
	userDataPath: string,
	ipcMain: IpcMain,
	mainWindow: BrowserWindow
) => {
	const windows: BrowserWindow[] = [mainWindow];

	ipcMain.handle(
		MainProcessMethodIdentifiers.CreatePresentation,
		async (_, pres?: SinglePresentation) => {
			const path = userDataPath + '/store';
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
			const timestamp = Date.now();
			const newPresentation: any = {
				id: currentId,
				name: pres?.name ?? presentationName,
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
					slides: [],
					...pres,
				})
			);

			return newPresentation;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.GetStoredPresentations,
		async () => {
			const path = userDataPath + '/store/presentations.json';

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
				`${fs.readFileSync(userDataPath + `/store/${id}.json`)}`
			);

			return file;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.deleteSinglePresentation,
		async (_, id) => {
			const path = userDataPath + `/store/${id}.json`;
			const audioPath = userDataPath + `/store/audio/${id}`;

			if (!fs.existsSync(path)) return;

			fs.unlinkSync(path);

			if (fs.existsSync(audioPath))
				fs.rmdirSync(audioPath, { recursive: true });

			const presentations = JSON.parse(
				`${fs.readFileSync(userDataPath + '/store/presentations.json')}`
			);

			const newPresentations = presentations.presentations.filter(
				(pres: any) => pres.id !== id
			);
			presentations.presentations = newPresentations;

			fs.writeFileSync(
				userDataPath + '/store/presentations.json',
				JSON.stringify(presentations)
			);
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.SaveChangesToPresentation,
		async (_, id: number, file: any, remoteTimestamp?: number) => {
			const oldFile = JSON.parse(
				`${fs.readFileSync(userDataPath + `/store/${id}.json`)}`
			);

			const timestamp = remoteTimestamp ?? Date.now();

			const newFile = { ...oldFile, ...file, lastChanges: timestamp };

			fs.writeFileSync(
				userDataPath + `/store/${id}.json`,
				JSON.stringify(newFile)
			);
			const presentations = JSON.parse(
				`${fs.readFileSync(userDataPath + '/store/presentations.json')}`
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
				userDataPath + '/store/presentations.json',
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
			const path = userDataPath + '/store';
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
			const files = dialog.showOpenDialogSync(mainWindow, {
				...FileExpolorerOptions[type],
			});

			if (!files || !files.length) return [];

			return await files.reduce(
				async (prev, file) =>
					path.extname(file) === ''
						? [...(await prev), ...(await getFilesInDir(file))]
						: [...(await prev), getFileFromPath(file)],
				Promise.resolve([])
			);
		}
	);

	ipcMain.handle(MainProcessMethodIdentifiers.DisplaysAvailable, async () => {
		return await screen.getAllDisplays().length;
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.StartPresenterMode,
		async (_, id: number, startingSlide: number, displayNumber?: number) => {
			if ((await screen.getAllDisplays().length) === 1) return;
			const display = screen.getAllDisplays()[displayNumber ?? 1];

			const presentation = new BrowserWindow({
				x: display.bounds.x + 50,
				y: display.bounds.y + 50,
				fullscreen: true,
				webPreferences: {
					// preload: __dirname + '/../preload.js',
					nodeIntegration: true,
					contextIsolation: false,
					webSecurity: false,
				},
				autoHideMenuBar: true,
			});

			// TODO: handle backaged version and load from according src
			presentation.loadURL(
				`http://localhost:3000/pres?id=${id}&startingSlide=${startingSlide}`
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
		const w = windows.pop();
		w.close();
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
		MainProcessMethodIdentifiers.storeAudioFile,
		async (_, id: number, buffer: Buffer) => {
			const path = `${userDataPath}/store/audio`;
			const presPath = `/${id}`;
			const fileName = `/${Date.now()}.wav`;

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
		const file = userDataPath + '/store/userSettings.json';
		return fs.existsSync(file)
			? JSON.parse(`${fs.readFileSync(file)}`)
			: { language: 'auto', theme: 'auto' };
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.saveUserSettings,
		async (_, settings: UserSettings) => {
			const path = userDataPath + '/store';

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
				const fileExtension = filePath.split('.').pop();
				const fileName = filePath.split('/').pop().split('.').shift();

				if (fileExtension === 'json') {
					fs.writeFileSync(
						filePath,
						JSON.stringify({ ...presentation, name: fileName })
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
			const fileExtension = path.split('.').pop();

			const file = parse.get(fileExtension)(path);

			return file;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.retriveFullFile,
		async (_, path: string) => {
			return fs.readFileSync(path);
		}
	);
};
