import {
	MediaRessource,
	SinglePresentation,
} from '../shared/types/presentation';
import { uploadMedia } from './MediaUploader';

interface MediaSyncTask {
	index: number;
	slide: number;
	mediaId: number;
	localLocation: string;
	downloadUrl?: string;
}

interface AudioSyncTask {
	index: number;
	slide: number | 'theme';
	localLoaction: string;
	downloadUrl?: string;
}

export const syncLocalPresentation = (
	userId: string,
	presentation: SinglePresentation,
	filteredMediaNames: { name: string; downloadUrl: string }[],
	onProgressUpdate: (progress: number) => void,
	didFinish: (tasks: MediaSyncTask[], audioTasks: AudioSyncTask[]) => void
) => {
	const imageTasks: MediaSyncTask[] = presentation.slides
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
			localLocation: media.media.location!.local!,
			downloadUrl: filteredMediaNames.find(
				(m) => m.name === media.media.location.local?.split('/').pop()!
			)?.downloadUrl,
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
			localLoaction: audio.audioLocation,
			downloadUrl: filteredMediaNames.find(
				(m) => m.name === audio.audioLocation.split('/').pop()!
			)?.downloadUrl,
		}));

	if (presentation.theme?.audio?.local) {
		audioTasks.push({
			index: audioTasks.length,
			slide: 'theme',
			localLoaction: presentation.theme!.audio!.local!.substring(7),
		});
	}

	let imagesCompleted = false;
	let audioCompleted = false;
	let imagesTotalBytes = 0;
	let audioTotalBytes = 0;
	let imagesTransferredBytes = 0;
	let audioTransferredBytes = 0;

	uploadMedia(
		userId,
		imageTasks
			.filter((image) => image.downloadUrl === undefined)
			.map((task) => ({
				path: task.localLocation,
				index: task.index,
				type: 'image',
			})),
		(totalBytes, transferredBytes) => {
			imagesTotalBytes = totalBytes;
			imagesTransferredBytes = transferredBytes;

			onProgressUpdate(
				((imagesTransferredBytes + audioTransferredBytes) /
					(imagesTotalBytes + audioTotalBytes)) *
					100
			);
		},
		(urls) => {
			imageTasks
				.filter((image) => image.downloadUrl === undefined)
				.forEach((task) => {
					task.downloadUrl = urls.get(task.index);
				});

			if (audioCompleted) didFinish(imageTasks, audioTasks);

			imagesCompleted = true;
		}
	);

	uploadMedia(
		userId,
		audioTasks
			.filter((audio) => audio.downloadUrl === undefined)
			.map((task) => ({
				path: task.localLoaction,
				index: task.index,
				type: 'audio',
			})),
		(totalBytes, transferredBytes) => {
			audioTotalBytes = totalBytes;
			audioTransferredBytes = transferredBytes;

			onProgressUpdate(
				((imagesTransferredBytes + audioTransferredBytes) /
					(imagesTotalBytes + audioTotalBytes)) *
					100
			);
		},
		(urls) => {
			audioTasks
				.filter((audio) => audio.downloadUrl === undefined)
				.forEach((task) => {
					task.downloadUrl = urls.get(task.index);
				});

			if (imagesCompleted) didFinish(imageTasks, audioTasks);

			audioCompleted = true;
		}
	);
};
