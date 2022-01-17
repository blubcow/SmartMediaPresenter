export const ImageResourceExtensions: readonly string[] = [
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
] as const;

export const AudioResourceExtensions: readonly string[] = [
	'wav',
	'wma',
	'mp3',
	'msv',
	'mpc',
	'aiff',
	'alac',
	'm4p',
] as const;

export const allowedFiles = [
	...ImageResourceExtensions.map((ext) => '.' + ext),
	...AudioResourceExtensions.map((ext) => '.' + ext),
];
