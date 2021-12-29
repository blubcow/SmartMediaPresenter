import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import {
	MediaRessource,
	SinglePresentation,
} from '../shared/types/presentation';
import { storage } from './firebase';
const { ipcRenderer } = window.require('electron');

interface MediaSyncTask {
	index: number;
	slide: number;
	mediaId: number;
	localLocation: string;
	downloadUrl?: string;
	totalBytes?: number;
	transferredBytes?: number;
	completed: boolean;
}

export const syncLocalPresentation = (
	userId: string,
	presentation: SinglePresentation,
	filteredMediaNames: { name: string; downloadUrl: string }[],
	onProgressUpdate: (progress: number) => void,
	didFinish: (tasks: MediaSyncTask[]) => void
) => {
	let totalBytesAccumulated = 0;
	let transferredBytesAccumulated = 0;

	const tasks: MediaSyncTask[] = presentation.slides
		.reduce((prev, slide) => {
			const newMedia = slide.media
				.filter((media) => media.location?.local !== undefined)
				.map((media) => ({ slide: slide.id, media: media }));
			return prev.concat(newMedia);
		}, [] as { slide: number; media: MediaRessource }[])
		.map((media, index) => ({
			index: index,
			slide: media.slide,
			mediaId: media.media.id,
			localLocation: media.media.location!.local!.substring(7),
			completed: false,
		}));

	tasks.forEach(async (task) => {
		const fileName = task.localLocation.split('/').pop()!;
		const availableRemoteMedia = filteredMediaNames.find(
			(media) => media.name === fileName
		);

		if (availableRemoteMedia) {
			tasks[task.index].completed = true;
			tasks[task.index].downloadUrl = availableRemoteMedia.downloadUrl;
			return;
		}

		const buffer = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.retriveFullFile,
			task.localLocation
		);

		const upload = storage.uploadFile(userId, fileName, buffer, {
			contentType: 'image/' + fileName?.split('.').pop()!,
		});

		upload.then((snapshot) => {
			storage.getDownloadURL(snapshot.ref).then((url) => {
				tasks[task.index].downloadUrl = url;
				if (snapshot.state === 'success') {
					tasks[task.index].completed = true;
					if (tasks.find((task) => !task.completed) === undefined) {
						didFinish(tasks);
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

			onProgressUpdate(
				(transferredBytesAccumulated / totalBytesAccumulated) * 100
			);
		});
	});
};
