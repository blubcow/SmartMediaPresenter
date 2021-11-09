import { BrowserWindow, dialog, IpcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const allowedFiles = ['.jpg', '.png', '.mp4'];

export const registerMainProcessMethodHandlers = (
	ipcMain: IpcMain,
	mainWindow: BrowserWindow
) => {
	ipcMain.handle('createPresentation', async () => {
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

	ipcMain.handle('getStoredPresentations', async () => {
		const path = __dirname + '/store/presentations.json';

		const presentations: any = fs.existsSync(path)
			? JSON.parse(`${fs.readFileSync(path)}`)
			: {
					count: 0,
					presentations: [],
			  };

		return presentations;
	});

	ipcMain.handle('getSinglePresentation', async (_, id: number) => {
		if (typeof id !== 'number') {
			return;
		}

		const file = JSON.parse(
			`${fs.readFileSync(__dirname + `/store/${id}.json`)}`
		);

		return file;
	});

	ipcMain.handle(
		'saveChangesToPresentation',
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

	ipcMain.handle('loadFilesFromDirectory', async (_, dirPath: string) => {
		return getFilesInDir(dirPath);
	});

	ipcMain.handle(
		'createPresentationQuickCreate',
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

	ipcMain.handle('openFileSelectorDialog', async () => {
		const files = dialog.showOpenDialogSync(mainWindow, {
			filters: [
				{ name: 'Images', extensions: ['jpg', 'png', 'gif'] },
				{ name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
			],
			properties: ['openFile', 'openDirectory'],
		});

		if (!files || !files.length) return [];

		return await files.reduce(
			async (prev, file) =>
				path.extname(file) === ''
					? [...(await prev), ...(await getFilesInDir(file))]
					: [...(await prev), getFileFromPath(file)],
			Promise.resolve([])
		);
	});
};
