import { BrowserWindow, IpcMain, IpcMainInvokeEvent, MessageBoxSyncOptions, dialog } from 'electron';
import { PythonShell, PythonShellError } from 'python-shell';
import * as path from 'path';
import * as fs from 'fs';
import { ChildProcess, ChildProcessWithoutNullStreams, exec, spawn, spawnSync } from 'child_process';

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
		async (_: IpcMainInvokeEvent, sourceImgPath: string, targetImgPath: string, method: number = 0, options?:string): Promise<string> => {

			console.log('userDataPath: ' + userDataPath);
			console.log('getAssetPath: ' + getAssetPath(''));

			// prepare output
			const storePath = userDataPath + '/store/colortransfer';
			if (!fs.existsSync(storePath)) {
				fs.mkdirSync(storePath);
			}
			const outputImgPath = storePath + '/current_result.jpg';

			// prepare script
			const assetPath = getAssetPath('python');
			let args;
			if(options == "quotes"){
				args = [
					'--source', '"'+sourceImgPath+'"', // Adding double qotes for error prevention
					'--target', '"'+targetImgPath+'"',
					'--output', '"'+outputImgPath+'"',
					'--method', method.toString()
				];
			}else{
				args = [
					'--source', sourceImgPath, // Adding double qotes for error prevention
					'--target', targetImgPath,
					'--output', outputImgPath,
					'--method', method.toString()
				];
			}

			if(options == 'python'){
				return simpleColorTransferDebug(assetPath, args, outputImgPath);
			}else if(options == 'single'){
				return simpleColorTransfer(assetPath, args, outputImgPath, '/dist/color_transfer.exe');
			}else{
				return simpleColorTransfer(assetPath, args, outputImgPath, '/dist/color_transfer/color_transfer.exe', options);
			}

			/*
			if(isDebug){
				return simpleColorTransferDebug(assetPath, args, outputImgPath);
			}else{
				return simpleColorTransfer(assetPath, args, outputImgPath);
			}
			*/
		}
	);

	function simpleColorTransfer(assetPath:string, args: string[], outputImgPath: string, scriptFile?: string, options?: string): Promise<string> {
		if(!scriptFile){
			scriptFile = '/dist/color_transfer/color_transfer.exe';
		}

		return new Promise<string>((resolve, reject) => {
			//const scriptPath = assetPath + '/dist/color_transfer/color_transfer.exe'; // packaged without "--onefile"
			let scriptPath = assetPath + scriptFile;
			// Put error buffer into single string
			let errorMsg:string = '';

			if(options == 'cmdquotes')
				scriptPath = '"'+scriptPath+'"';
			const process: ChildProcessWithoutNullStreams = spawn(scriptPath, args, {shell: false});
			
			// Could not find file to execute (usually)
			process.on('error', function(err:Error){
				errorMsg += err.toString() + "\n";
			});

			console.log('spawn process command: ' + scriptPath + ' ' + args.join(' '));

			process.stdout.on('data', (data:Buffer) => {
				console.log('process message: ' + data.toString() + '\n');
			});

			process.stderr.on('data', (data:Buffer) => {
				errorMsg += data.toString() + "\n";
			});

			process.on('close', (code) => {
				if(code == 0){
					resolve(outputImgPath);
				}else{
					handleProcessError(errorMsg, scriptPath, args);
					reject('process error');
				}
			});
		});
	};

	function simpleColorTransferDebug(assetPath:string, args: string[], outputImgPath: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const scriptPath = assetPath + '/color_transfer.py';

			const pythonShell: PythonShell = new PythonShell(scriptPath, { args });

			console.log('python command: ' + pythonShell.command);

			pythonShell.on('message', function (message) {
				console.log('python message: ' + message + '\n');
			});

			pythonShell.end(function (err) {
				if (!err) {
					resolve(outputImgPath);
				} else {
					handlePythonError(err, scriptPath, args);
					reject('python error');
				}
			});
		});
	}

	async function handleProcessError(message: string|number, scriptName:string, args:string[]): Promise<void>{
		const messageBoxOptions: MessageBoxSyncOptions = {
			type: "error",
			title: "Process Error",
			message: "The process '" + scriptName + "' has encountered an error",
			detail: "Arguments used: " + args.join(' ') + "\n\n" + message.toString()
		};
		dialog.showMessageBoxSync(messageBoxOptions);
	}
	
	/**
	 * Error handling for python-shell (debug mode)
	 * @param scriptName The python file name to display
	 */
	async function handlePythonError(e: PythonShellError, scriptName: string, args:string[]): Promise<void>{
		const messageBoxOptions: MessageBoxSyncOptions = {
			type: "error",
			title: "Python Error",
			message: "The python script '" + scriptName + "' has encountered an error",
			detail: "Arguments used: " + args.join(' ') + "\n\n" + e.message
		};
		dialog.showMessageBoxSync(messageBoxOptions);
		console.log(e.stack);
	}
};
