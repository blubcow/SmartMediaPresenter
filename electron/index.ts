import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
	});

	const appLocation = app.isPackaged
		? path.join(__dirname, '/../index.html')
		: 'http://localhost:3000';
	mainWindow.loadURL(appLocation);

	mainWindow.webContents.openDevTools();

	mainWindow.maximize();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.on('ready', createWindow);
