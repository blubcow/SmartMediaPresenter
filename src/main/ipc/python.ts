import { BrowserWindow, IpcMain, IpcMainInvokeEvent, MessageBoxSyncOptions, dialog } from 'electron';
import { PythonShell, PythonShellError } from 'python-shell';
import * as path from 'path';
import * as fs from 'fs';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

// Set this to "true" to test packaged version of the python scripts
// Package your python scripts first with "pyinstaller example.py --nowindowed"
const FORCE_RUN_PACKAGED_PYTHON:boolean = true;

export const registerMainProcessPythonHandlers = (
	userDataPath: string,
	ipcMain: IpcMain,
	mainWindow: BrowserWindow,
	getAssetPath: (...paths: string[]) => string,
	isDebug: boolean
) => {
	const windows: BrowserWindow[] = [mainWindow];

	// Python storage in /userDataPath + /store + /<<folder>>
	function createPythonStorePath(folder:string): string{
		const storePath = path.join(userDataPath, 'store', folder)
		if (!fs.existsSync(storePath)) {
			fs.mkdirSync(storePath);
		}
		return storePath
	}

	// TODO: This is not strictly python related - move out of "python.ts"
	ipcMain.handle(
		'python.saveImage',
		async (_: IpcMainInvokeEvent, imgPath: string, originalImgPath: string): Promise<string> => {
			return new Promise<string>((resolve, reject) => {
				dialog.showSaveDialog({ 
					title: 'Select the File Path to save', 
					defaultPath: path.basename(originalImgPath),
					buttonLabel: 'Save', 
					filters: [ 
						{ 
							name: 'Image File', 
							extensions: ['jpg'] 
						}, ], 
					properties: [] 
				}).then(file => {

					if (!file.canceled && file.filePath) { 

						if(!fs.existsSync(imgPath)) {
							handleError('File not found', imgPath);
							reject('File not found');
					 	}
						const data = fs.readFileSync(imgPath);

						// Creating and Writing to the sample.txt file 
						fs.writeFile(file.filePath.toString(), data, function (err) { 
							if (err){
								handleError('Could not write file', file.filePath!.toString());
								reject('Could not write file');
							}
							resolve(file.filePath!.toString());
						});
					}

				}).catch(err => { 
					console.log(err);
					reject('Unknown error');
				});
			});
		}
	)

	// Image alignment
	ipcMain.handle(
		'python.imageAlignment',
		async (_: IpcMainInvokeEvent, leftImgPath: string, rightImgPath: string): Promise<string> => {

			// prepare output
			const outputImgPath = path.join(createPythonStorePath('imagealignment'), 'current_result.jpg');

			// prepare script
			const args = [
				'--left', leftImgPath,
				'--right', rightImgPath,
				'--output', outputImgPath
			];

			// Switch to running python directly while developing
			if(isDebug && !FORCE_RUN_PACKAGED_PYTHON){
				return runPython('image_alignment.py', args, outputImgPath);
			}else{
				return runExecutable('dist/image_alignment/image_alignment.exe', args, outputImgPath);
			}
		}
	);
	
	// Color transfer
	ipcMain.handle(
		'python.simpleColorTransfer',
		async (_: IpcMainInvokeEvent, sourceImgPath: string, targetImgPath: string, method: number = 0): Promise<string> => {

			// prepare output
			const outputImgPath = path.join(createPythonStorePath('colortransfer'), 'current_result.jpg');

			// prepare script
			const args = [
				'--source', sourceImgPath, // Adding double qotes for error prevention
				'--target', targetImgPath,
				'--output', outputImgPath,
				'--method', method.toString()
			];

			if(isDebug && !FORCE_RUN_PACKAGED_PYTHON){
				return runPython('color_transfer.py', args, outputImgPath);
			}else{
				return runExecutable('dist/color_transfer/color_transfer.exe', args, outputImgPath);

				// Running packaged build by default. To run a unified executable, you could choose:
				//return runExecutable('dist/color_transfer.exe', args, outputImgPath);
			}
		}
	);

	/**
	 * Run compiled program
	 * @param executablePath Should be relative to "assets/python"
	 * @param args Arguments passed on to the python script
	 * @param returnValue Value the Promise is resolved with // TODO: Move out of the function
	 * @returns returnValue Promise
	 */
	function runExecutable(executablePath: string, args: string[], returnValue: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			// Put error buffer into single string
			let errorMsg:string = '';

			let process: ChildProcessWithoutNullStreams;
			process = spawn(getAssetPath('python', executablePath), args, {shell: false});
			
			// Could not find file to execute (usually)
			process.on('error', function(err:Error){
				errorMsg += err.toString() + "\n";
			});

			console.log('spawn process command: ' + executablePath + ' ' + args.join(' '));

			process.stdout.on('data', (data:Buffer) => {
				console.log('process message: ' + data.toString() + '\n');
			});

			process.stderr.on('data', (data:Buffer) => {
				errorMsg += data.toString() + "\n";
			});

			process.on('close', (code) => {
				if(code == 0){
					resolve(returnValue);
				}else{
					handleProcessError(errorMsg, executablePath, args);
					reject('process error');
				}
			});
		});
	};

	/**
	 * Run python file with "PythonShell"
	 * @param scriptPath Should be relative to "assets/python"
	 * @param args Arguments passed on to the python script
	 * @param returnValue Value returned when resolving
	 * @returns returnValue Promise
	 */
	function runPython(scriptPath: string, args: string[], returnValue: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const pythonShell: PythonShell = new PythonShell(getAssetPath('python', scriptPath), { args });

			console.log('python-shell command: ' + pythonShell.command);

			pythonShell.on('message', function (message) {
				console.log('python message: ' + message + '\n');
			});

			pythonShell.end(function (err) {
				if (!err) {
					resolve(returnValue);
				} else {
					handlePythonError(err, scriptPath, args);
					reject('python error');
				}
			});
		});
	}

	/**
	 * Error handling for child_process.spawn command
	 * @param scriptName The python file name to display
	 */
	async function handleError(message: string, detail:string): Promise<void>{
		const messageBoxOptions: MessageBoxSyncOptions = {
			type: "error",
			title: "Error",
			message: message,
			detail: detail
		};
		dialog.showMessageBoxSync(messageBoxOptions);
	}

	/**
	 * Error handling for child_process.spawn command
	 * @param scriptName The python file name to display
	 */
	async function handleProcessError(message: string|number, processName:string, args:string[]): Promise<void>{
		const messageBoxOptions: MessageBoxSyncOptions = {
			type: "error",
			title: "Process Error",
			message: "The process '" + processName + "' has encountered an error",
			detail: "Arguments used: " + args.join(' ') + "\n\n" + message.toString()
		};
		dialog.showMessageBoxSync(messageBoxOptions);
	}
	
	/**
	 * Error handling for python-shell execution
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
