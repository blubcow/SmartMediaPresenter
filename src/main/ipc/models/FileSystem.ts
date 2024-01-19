import * as fs from 'fs';
import * as path from 'path';
import { PresentationFileAvailableExtensions } from '../../../renderer/shared/types/presentationFormat';
import { allowedFiles } from '../../../renderer/shared/types/mediaResources';

export interface IFileInfo{
	name: string,
	location: {
		local: string
	},
	added: number // Timestamp
}

export const getFileFromPath = (path: string): IFileInfo => {
	const extension = path.split('.').reverse()[0];
	const presExtensions = [...PresentationFileAvailableExtensions] as string[];

	return {
		name: path.split('/').reverse()[0],
		location: {
			local: `${presExtensions.includes(extension) ? '' : 'file://'}${path}`,
		},
		added: Date.now(),
	};
};

export const getFilesInDir = (dirPath: string): IFileInfo[] => {
	// TODO: Do we have to use async in production? Better use async... look at async version of "readdirSync"
	return fs.readdirSync(dirPath)
		.filter((value) => allowedFiles.includes(path.extname(value)))
		.reduce<IFileInfo[]>(
			(prev, value) => {
				const newVal:IFileInfo = {
					name: value,
					location: { local: `file://${dirPath}/${value}` },
					added: Date.now(),
				};
				prev.push(newVal);
				return prev;
			},
			[]
		);
};
