type FileExplorereProperties = (
	| 'openFile'
	| 'openDirectory'
	| 'multiSelections'
	| 'showHiddenFiles'
	| 'createDirectory'
	| 'promptToCreate'
	| 'noResolveAliases'
	| 'treatPackageAsDirectory'
	| 'dontAddToRecent'
)[];

export const FileExpolorerOptions = {
	media: {
		filters: [
			{
				name: 'Images',
				extensions: [
					'jpg',
					'jpeg',
					'jfif',
					'pjpeg',
					'pjp',
					'png',
					'apng',
					'avif',
					'gif',
					'tiff',
					'raw',
					'webp',
				],
			},
		],
		properties: ['openFile', 'openDirectory'] as FileExplorereProperties,
	},
	audio: {
		filters: [
			{
				name: 'Audio',
				extensions: ['wav', 'wma', 'mp3', 'msv', 'mpc', 'aiff', 'alac', 'm4p'],
			},
		],
		properties: ['openFile'] as FileExplorereProperties,
	},
	save: {
		properties: ['createDirectory'],
		showsTagField: false,
		filters: [
			{ name: 'json', extensions: ['json'] },
			{ name: 'excel', extensions: ['xlsx'] },
		],
	},
};
