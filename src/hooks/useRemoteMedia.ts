import { useCallback } from 'react';
import { RemoteStorageMedia } from '../types/presentaitonSycncing';
import { uploadMedia } from '../models/MediaUploader';
import { ImageResourceExtensions } from '../shared/types/mediaResources';
import { RemoteUser } from '../types/remote';
import { storage } from '../models/firebase';

const useRemoteMedia = (remoteUser?: RemoteUser) => {
	const uploadRemoteMedia = useCallback(
		(
			filePaths: string[],
			onProgressUpdate: (progress: number) => void,
			callback: (media: RemoteStorageMedia[]) => void,
			path?: string
		) => {
			if (remoteUser === undefined) return;

			const tasks = filePaths.map((path, index) => ({
				path: path,
				index: index,
				type: ImageResourceExtensions.includes(
					(path.split('.').pop() ?? '').toLowerCase()
				)
					? 'image'
					: 'audio',
			}));

			uploadMedia(
				remoteUser.uid +
					`${path !== undefined && path.length > 0 ? '/' : ''}${path}`,
				tasks,
				(total, transferred) => {
					onProgressUpdate((transferred / total) * 100);
				},
				(urls) => {
					callback(
						tasks.map((task) => ({
							name: task.path.split('/').pop() ?? 'name not found',
							type: 'file',
							path: task.path,
							url: urls.get(task.index),
						})) as RemoteStorageMedia[]
					);
				}
			);
		},
		[remoteUser]
	);

	const deleteDir = useCallback(
		async (path: string) => {
			const result = await storage.listRemoteMedia(remoteUser!.uid, path);
			const items: RemoteStorageMedia[] = result.items.map((i) => ({
				name: i.name,
				path: i.fullPath.replace(remoteUser!.uid + '/', ''),
				type: 'file',
			}));
			result.prefixes.forEach((dir) => {
				items.push({
					name: dir.name,
					path: dir.fullPath.replace(remoteUser!.uid + '/', ''),
					type: 'dir',
				});
			});

			await Promise.all(
				items.map(
					async (item) =>
						await (item.type === 'dir'
							? deleteDir(item.path)
							: deleteSingleFile(item.path))
				)
			);
		},
		[storage]
	);

	const deleteSingleFile = useCallback(
		async (path: string) => {
			return await storage.deleteFile(remoteUser!.uid, path);
		},
		[storage]
	);

	const deleteRemoteFiles = useCallback(
		(files: RemoteStorageMedia[], callback: () => void) => {
			if (remoteUser === undefined) return;

			Promise.all(
				files.map(async (item) => {
					if (item.type === 'file') {
						return await deleteSingleFile(item.path);
					} else {
						return await deleteDir(item.path);
					}
				})
			).then(() => callback());
		},
		[]
	);

	const createFolder = useCallback(
		(
			folderName: string,
			callback: (folder: RemoteStorageMedia) => void,
			path?: string
		) => {
			if (remoteUser === undefined) return;

			storage.createFolder(remoteUser.uid, folderName, path).then((r) => {
				callback({
					name: folderName,
					type: 'dir',
					path: `${path ?? ''}${path ? '/' : ''}${folderName}`,
				});
			});
		},
		[remoteUser, storage]
	);

	const getRemoteMedia = useCallback(
		(callback: (files: RemoteStorageMedia[]) => void, path?: string) => {
			if (remoteUser === undefined) return;

			storage.listRemoteMedia(remoteUser.uid, path).then((media) =>
				Promise.all(
					media.items
						.filter((item) => item.name !== '.keep')
						.map(async (item) => {
							const path = item.fullPath.replace(remoteUser.uid + '/', '');
							return {
								name: item.name,
								path: path,
								type: 'file',
								url: await storage.getDownloadUrlFromFileName(
									remoteUser.uid,
									path
								),
							} as RemoteStorageMedia;
						})
				).then((r) => {
					media.prefixes.forEach((prefix) => {
						r.push({
							type: 'dir',
							name: prefix.name,
							path: prefix.fullPath.replace(remoteUser.uid + '/', ''),
						});
					});
					callback(r);
				})
			);
		},
		[storage, remoteUser]
	);

	return { uploadRemoteMedia, deleteRemoteFiles, createFolder, getRemoteMedia };
};

export default useRemoteMedia;
