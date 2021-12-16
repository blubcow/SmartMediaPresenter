import { BrowserWindow, dialog, IpcMain, screen } from 'electron';
import { MainProcessMethodIdentifiers } from '../src/shared/types/identifiers';
import { allowedFiles } from '../src/shared/types/mediaResources';
import * as path from 'path';
import * as fs from 'fs';
import { FileExpolorerOptions } from './types/fileExplorer';
import { FileExplorerType } from '../src/shared/types/fileExplorer';
import { getFonts } from 'font-list';
import { UserSettings } from '../src/shared/types/userSettings';

export const registerMainProcessMethodHandlers = (
	ipcMain: IpcMain,
	mainWindow: BrowserWindow
) => {
	const windows: BrowserWindow[] = [mainWindow];

	ipcMain.handle(MainProcessMethodIdentifiers.CreatePresentation, async () => {
		const path = __dirname + '/store';
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
				slides: [],
			})
		);

		return newPresentation;
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.GetStoredPresentations,
		async () => {
			const path = __dirname + '/store/presentations.json';

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
				`${fs.readFileSync(__dirname + `/store/${id}.json`)}`
			);

			return file;
		}
	);

	ipcMain.handle(
		MainProcessMethodIdentifiers.SaveChangesToPresentation,
		async (_, id: number, file: any) => {
			const oldFile = JSON.parse(
				`${fs.readFileSync(__dirname + `/store/${id}.json`)}`
			);

			const timestamp = Date.now();

			const newFile = { ...oldFile, ...file, lastChanges: timestamp };

			fs.writeFileSync(
				__dirname + `/store/${id}.json`,
				JSON.stringify(newFile)
			);
			const presentations = JSON.parse(
				`${fs.readFileSync(__dirname + '/store/presentations.json')}`
			);
			const pres = presentations.presentations.find(
				(presentation: any) => presentation.id === id
			);
			const newPres = presentations.presentations.filter(
				(presentation: any) => presentation.id !== id
			);

			pres.created = timestamp;
			pres.name = file.name ?? pres.name;

			newPres.push(pres);

			presentations.presentations = newPres;

			fs.writeFileSync(
				__dirname + '/store/presentations.json',
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
			const path = __dirname + '/store';
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

	const getFilesInDir = async (dirPath: string) => {
		return await fs
			.readdirSync(dirPath)
			.filter((value) => allowedFiles.includes(path.extname(value)))
			.reduce(
				(prev, value) => [
					...prev,
					{
						name: value,
						location: { local: `file://${dirPath}/${value}` },
						added: Date.now(),
					},
				],
				[]
			);
	};

	const getFileFromPath = (path: string) => {
		return {
			name: path.split('/').pop(),
			location: { local: `file://${path}` },
			added: Date.now(),
		};
	};

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
		async (_, id: number, displayNumber?: number) => {
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
			});
			// presentation.webContents.openDevTools();
			presentation.loadURL(`http://localhost:3000/pres?id=${id}`);
			presentation.maximize();
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
			const path = `${__dirname}/store/audio`;
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
		const file = __dirname + '/store/userSettings.json';
		return fs.existsSync(file)
			? JSON.parse(`${fs.readFileSync(file)}`)
			: { language: 'auto', theme: 'auto' };
	});

	ipcMain.handle(
		MainProcessMethodIdentifiers.saveUserSettings,
		async (_, settings: UserSettings) => {
			const path = __dirname + '/store';

			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}

			fs.writeFileSync(path + '/userSettings.json', JSON.stringify(settings));
		}
	);
};
