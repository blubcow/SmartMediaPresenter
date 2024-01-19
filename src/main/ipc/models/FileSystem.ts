import * as fs from 'fs';
import * as path from 'path';
import { PresentationFileAvailableExtensions } from '../../src/shared/types/presentationFormat';
import { allowedFiles } from '../../src/shared/types/mediaResources';

export const getFileFromPath = (path: string) => {
	const extension = path.split('.').pop();
	const presExtensions = [...PresentationFileAvailableExtensions] as string[];

	return {
		name: path.split('/').pop(),
		location: {
			local: `${presExtensions.includes(extension) ? '' : 'file://'}${path}`,
		},
		added: Date.now(),
	};
};

export const getFilesInDir = async (dirPath: string) => {
	return await fs
		.readdirSync(dirPath)
		.filter((value) => allowedFiles.includes(path.extname(value)))
		.reduce(
			(prev, value) => [
				...prev,
				{
					name: value,
					location: { local: `file://${dirPath}/${value}` },
					added: Date.now(),
				},
			],
			[]
		);
};
