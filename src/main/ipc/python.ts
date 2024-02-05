import { BrowserWindow, IpcMain, IpcMainInvokeEvent, MessageBoxSyncOptions, dialog } from 'electron';
import { PythonShell, PythonShellError } from 'python-shell';
import * as path from 'path';
import * as fs from 'fs';
import { ChildProcess, ChildProcessWithoutNullStreams, spawn } from 'child_process';

let globalWorkspace: string | undefined;

export const registerMainProcessPythonHandlers = (
	userDataPath: string,
	ipcMain: IpcMain,
	mainWindow: BrowserWindow,
	getAssetPath: (...paths: string[]) => string,
	isDebug: boolean
) => {
	const windows: BrowserWindow[] = [mainWindow];

	ipcMain.handle(
		'python.simpleColorTransfer',
		async (_: IpcMainInvokeEvent, sourceImgPath: string, targetImgPath: string): Promise<string> => {

			console.log('userDataPath: ' + userDataPath);
			console.log('getAssetPath: ' + getAssetPath(''));

			// prepare output
			const storePath = userDataPath + '/store/colortransfer';
			if (!fs.existsSync(storePath)) {
				fs.mkdirSync(storePath);
			}
			const outputImgPath = storePath + '/testimage.jpg';

			// prepare script
			const assetPath = getAssetPath('python');
			const args = [
				'--source', sourceImgPath,
				'--target', targetImgPath,
				'--output', outputImgPath
			];

			if(isDebug){
				handleError('This should only run in development environment', 'example.py');
				return simpleColorTransferDebug(assetPath, args, outputImgPath);
			}else{
				return simpleColorTransfer(assetPath, args, outputImgPath);
			}
		}
	);

	function simpleColorTransfer(assetPath:string, args: string[], outputImgPath: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const scriptPath = assetPath + '/dist/example/example.exe';

			const process: ChildProcessWithoutNullStreams = spawn(scriptPath, args);

			console.log('execute process: ' + scriptPath + ' ' + args.join(' '));

			process.stdout.on('data', (data) => {
				console.log('process message: ' + data + '\n');
			});

			process.stderr.on('data', (data) => {
				handleProcessError(data, 'example.py');
			});

			process.on('close', (code) => {
				if(code == 0){
					resolve(outputImgPath);
				}else{
					handleProcessError(code ?? 'NULL', 'example.exe');
					reject();
				}
			});
		});
	};

	function simpleColorTransferDebug(assetPath:string, args: string[], outputImgPath: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const scriptPath = assetPath + '/example.py';

			const pythonShell: PythonShell = new PythonShell(scriptPath, { args });

			console.log('python command: ' + pythonShell.command);

			pythonShell.on('message', function (message) {
				console.log('python message: ' + message + '\n');
			});

			pythonShell.end(function (err) {
				if (!err) {
					resolve(outputImgPath);
				} else {
					handlePythonError(err, 'example.py');
					reject();
				}
			});
		});
	}

	function handleProcessError(message: string|number, scriptName:string){
		const messageBoxOptions: MessageBoxSyncOptions = {
			type: "error",
			title: "Python Error",
			message: "The python script '" + scriptName + "' has encountered an error",
			detail: message as string
		};
		dialog.showMessageBoxSync(messageBoxOptions);
	}
	
	/**
	 * Error handling for python-shell (debug mode)
	 * @param scriptName The python file name to display
	 */
	function handlePythonError(e: PythonShellError, scriptName: string) {
		const messageBoxOptions: MessageBoxSyncOptions = {
			type: "error",
			title: "Python Error",
			message: "The python script '" + scriptName + "' has encountered an error",
			detail: e.message
		};
		dialog.showMessageBoxSync(messageBoxOptions);
		console.log(e.stack);
	}
};
