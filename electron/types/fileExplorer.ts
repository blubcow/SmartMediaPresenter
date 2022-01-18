import {
	AudioResourceExtensions,
	ImageResourceExtensions,
} from '../../src/shared/types/mediaResources';
import { PresentationFileAvailableExtensions } from '../../src/shared/types/presentationFormat';

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
				extensions: [...ImageResourceExtensions],
			},
		],
		properties: ['openFile', 'openDirectory'] as FileExplorereProperties,
	},
	audio: {
		filters: [
			{
				name: 'Audio',
				extensions: [...AudioResourceExtensions],
			},
		],
		properties: ['openFile'] as FileExplorereProperties,
	},
	presentation: {
		filters: [
			{
				name: 'Presentation',
				extensions: [...PresentationFileAvailableExtensions],
			},
		],
		properties: ['openFile'] as FileExplorereProperties,
	},
	save: {
		properties: ['createDirectory'] as FileExplorereProperties,
		showsTagField: false,
		filters: [
			{ name: 'json', extensions: ['json'] },
			{ name: 'excel', extensions: ['xlsx'] },
		],
	},
	remote: {
		filters: [
			{
				name: 'Media',
				extensions: [...AudioResourceExtensions, ...ImageResourceExtensions],
			},
		],
		properties: ['openFile', 'multiSelections'] as FileExplorereProperties,
	},
};
