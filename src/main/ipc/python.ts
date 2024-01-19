import { BrowserWindow, IpcMain, MessageBoxSyncOptions, dialog } from 'electron';
import { PythonShell, PythonShellError } from 'python-shell';
import * as path from 'path';
import * as fs from 'fs';

let globalWorkspace: string | undefined;

export const registerMainProcessPythonHandlers = (
	userDataPath: string,
	ipcMain: IpcMain,
	mainWindow: BrowserWindow,
	getAssetPath: (...paths:string[]) => string
) => {
	const windows: BrowserWindow[] = [mainWindow];

	function handlePythonError(e:PythonShellError, scriptName:string){
		const messageBoxOptions:MessageBoxSyncOptions = {
			type: "error",
			title: "Python Error",
			message: "The python script '"+scriptName+"' has encountered an error",
			detail: e.message
		};
		dialog.showMessageBoxSync( messageBoxOptions);
		console.log(e.stack);
	}

	ipcMain.handle(
		'pythontest',
		async (_, sourceImgPath:string, targetImgPath:string): Promise<string> => {
			return new Promise<string>((resolve, reject) => {
				console.log('userDataPath: '+userDataPath);
				console.log('getAssetPath: '+getAssetPath(''));

				const pythonAssetPath = getAssetPath('python');
				const pythonScriptPath = pythonAssetPath + '/example.py';
				//const sourceImgPath = pythonAssetPath + '/images/autumn.jpg';
				//const targetImgPath = pythonAssetPath + '/images/fallingwater.jpg';

				const storePath = userDataPath + '/store/colortransfer';
				if (!fs.existsSync(storePath)) {
					fs.mkdirSync(storePath);
				}
				const outputImgPath = storePath + '/testimage.jpg';

				const pythonShell:PythonShell = new PythonShell(pythonScriptPath, {
					args: [
						'--source', sourceImgPath, 
						'--target', targetImgPath,
						'--output', outputImgPath
					],
				});

				console.log('python command: '+pythonShell.command);

				pythonShell.on('message', function(message) {
					console.log('python message: '+message+'\n');
				});
				
				pythonShell.end(function (err) {
					if (!err){
						resolve(outputImgPath);
					}else{
						handlePythonError(err, 'example.py');
						reject();
					}
				});
			});
		}
	);
};
