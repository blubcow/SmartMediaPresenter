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

interface AudioSyncTask {
	index: number;
	slide: number | 'theme';
	localLoaction: string;
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
	didFinish: (tasks: MediaSyncTask[], audioTasks: AudioSyncTask[]) => void
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

	const audioTasks: AudioSyncTask[] = presentation.slides
		.filter((slide) => slide.audio?.location.local !== undefined)
		.reduce((prev, slide) => {
			return [
				...prev,
				{ slide: slide.id, audioLocation: slide.audio?.location.local ?? '' },
			];
		}, [] as { slide: number; audioLocation: string }[])
		.map((audio, index) => ({
			index: index,
			slide: audio.slide,
			localLoaction: audio.audioLocation.substring(7),
			completed: false,
		}));

	if (presentation.theme?.audio?.local) {
		audioTasks.push({
			index: audioTasks.length,
			slide: 'theme',
			localLoaction: presentation.theme!.audio!.local!,
			completed: false,
		});
	}

	if (tasks.length === 0 && audioTasks.length === 0) {
		onProgressUpdate(100);
		didFinish(tasks, audioTasks);
		return;
	}

	tasks.forEach(async (task) => {
		const fileName = task.localLocation.split('/').pop()!;
		const availableRemoteMedia = filteredMediaNames.find(
			(media) => media.name === fileName
		);

		if (availableRemoteMedia) {
			tasks[task.index].completed = true;
			tasks[task.index].downloadUrl = availableRemoteMedia.downloadUrl;
			if (
				tasks.find((task) => !task.completed) === undefined &&
				audioTasks.find((task) => !task.completed) === undefined
			) {
				didFinish(tasks, audioTasks);
			}
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
					if (
						tasks.find((task) => !task.completed) === undefined &&
						audioTasks.find((task) => !task.completed) === undefined
					) {
						didFinish(tasks, audioTasks);
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

	audioTasks.forEach(async (audioTask) => {
		const fileName = audioTask.localLoaction.split('/').pop()!;
		const availableRemoteAudio = filteredMediaNames.find(
			(media) => media.name === fileName
		);

		if (availableRemoteAudio) {
			audioTasks[audioTask.index].completed = true;
			audioTasks[audioTask.index].downloadUrl =
				availableRemoteAudio.downloadUrl;
			if (
				audioTasks.find((task) => !task.completed) === undefined &&
				tasks.find((task) => !task.completed) === undefined
			) {
				didFinish(tasks, audioTasks);
			}
			return;
		}

		const buffer = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.retriveFullFile,
			audioTask.localLoaction
		);

		const upload = storage.uploadFile(userId, fileName, buffer, {
			contentType: 'audio/' + fileName?.split('.').pop()!,
		});

		upload.then((snapshot) => {
			storage.getDownloadURL(snapshot.ref).then((url) => {
				audioTasks[audioTask.index].downloadUrl = url;
				if (snapshot.state === 'success') {
					audioTasks[audioTask.index].completed = true;
					if (
						audioTasks.find((task) => !task.completed) === undefined &&
						tasks.find((task) => !task.completed) === undefined
					) {
						didFinish(tasks, audioTasks);
					}
				}
			});
		});

		upload.on('state_changed', (snapshot) => {
			if (audioTasks[audioTask.index].totalBytes === undefined) {
				totalBytesAccumulated += snapshot.totalBytes;
			}

			audioTasks[audioTask.index].totalBytes = snapshot.totalBytes;

			const transferredBytesDiff =
				snapshot.bytesTransferred -
				(audioTasks[audioTask.index].transferredBytes ?? 0);

			transferredBytesAccumulated += transferredBytesDiff;

			audioTasks[audioTask.index].transferredBytes = snapshot.bytesTransferred;

			onProgressUpdate(
				(transferredBytesAccumulated / totalBytesAccumulated) * 100
			);
		});
	});
};
