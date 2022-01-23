import { app, BrowserWindow, IpcRenderer, ipcMain } from 'electron';
import * as path from 'path';
import { electron } from 'process';
import { registerMainProcessMethodHandlers } from './methods';

let mainWindow: BrowserWindow | null;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		minWidth: 1200,
		minHeight: 600,
		webPreferences: {
			// preload: __dirname + '/../preload.js',
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: app.isPackaged,
		},
		autoHideMenuBar: true,
	});

	const appLocation = app.isPackaged
		? `file://${path.join(__dirname, '../index.html')}`
		: 'http://localhost:3000';
	mainWindow.loadURL(appLocation);

	// mainWindow.webContents.openDevTools();

	mainWindow.maximize();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	registerMainProcessMethodHandlers(
		app.getPath('userData'),
		ipcMain,
		mainWindow
	);
};

app.on('ready', createWindow);

declare global {
	interface Window {
		ipcRenderer: IpcRenderer;
	}
}
