import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import { storage } from './firebase';

const { ipcRenderer } = window.require('electron');

interface UploadFile {
	path: string;
	type: string;
	index: number;
}

interface UploadTask extends UploadFile {
	completed: boolean;
	totalBytes?: number;
	transferredBytes?: number;
}

export const uploadMedia = (
	path: string,
	files: UploadFile[],
	onProgressUpdate: (totalBytes: number, transferredBytes: number) => void,
	didFinish: (downloadUrls: Map<number, string>) => void
) => {
	let totalBytesAccumulated = 0;
	let transferredBytesAccumulated = 0;
	const urls = new Map<number, string>();

	const tasks: UploadTask[] = files.map((file) => ({
		path: file.path.startsWith('file://') ? file.path.substring(7) : file.path,
		completed: false,
		index: file.index,
		type: file.type,
	}));

	if (tasks.length === 0) {
		onProgressUpdate(0, 0);
		didFinish(new Map());
		return;
	}

	tasks.forEach(async (task) => {
		const fileName = task.path.split('/').pop()!;

		try {
			const buffer = await ipcRenderer.invoke(
				MainProcessMethodIdentifiers.retriveFullFile,
				task.path
			);

			const upload = storage.uploadFile(path, fileName, buffer, {
				contentType: task.type + '/' + fileName?.split('.').pop()!,
			});

			upload.then((snapshot) => {
				storage.getDownloadURL(snapshot.ref).then((url) => {
					urls.set(task.index, url);
					if (snapshot.state === 'success') {
						tasks[task.index].completed = true;
						if (tasks.find((task) => !task.completed) === undefined) {
							didFinish(urls);
						}
					}
				});
			});

			upload.on('state_changed', (snapshot) => {
				if (tasks[task.index].totalBytes === undefined) {
					totalBytesAccumulated += snapshot.totalBytes;
				}

				tasks[task.index].totalBytes = snapshot.totalBytes;

				const transferredBytesDiff =
					snapshot.bytesTransferred - (tasks[task.index].transferredBytes ?? 0);

				transferredBytesAccumulated += transferredBytesDiff;

				tasks[task.index].transferredBytes = snapshot.bytesTransferred;

				onProgressUpdate(totalBytesAccumulated, transferredBytesAccumulated);
			});
		} catch {
			task.completed = true;
			if (tasks.find((task) => !task.completed) === undefined) {
				didFinish(urls);
			}
		}
	});
};
