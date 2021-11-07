import { ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { MainProcessMethodIdentifiers } from '../src/shared/types/identifiers';
import { allowedFiles } from '../src/shared/types/mediaResources';

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

		fs.writeFileSync(__dirname + `/store/${id}.json`, JSON.stringify(newFile));
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
		const timestamp = Date.now();

		const fileList: any[] = fs
			.readdirSync(dirPath)
			.filter((value) => allowedFiles.includes(path.extname(value)))
			.reduce(
				(prev, value) => [
					...prev,
					{
						name: value,
						location: { local: `file://${dirPath}/${value}` },
						added: timestamp,
					},
				],
				[]
			);

		return fileList;
	}
);
