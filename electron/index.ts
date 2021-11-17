import { app, BrowserWindow, IpcRenderer, ipcMain } from 'electron';
import * as path from 'path';
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
			webSecurity: false,
		},
	});

	const appLocation = app.isPackaged
		? path.join(__dirname, '/../index.html')
		: 'http://localhost:3000';
	mainWindow.loadURL(appLocation);

	// mainWindow.webContents.openDevTools();

	mainWindow.maximize();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.on('ready', createWindow);

declare global {
	interface Window {
		ipcRenderer: IpcRenderer;
	}
}

registerMainProcessMethodHandlers(ipcMain, mainWindow);
