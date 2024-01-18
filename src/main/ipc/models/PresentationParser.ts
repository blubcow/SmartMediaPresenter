import * as fs from 'fs';
import { SinglePresentation } from '../../src/shared/types/presentation';
import xlsx from 'xlsx';
import { convertXlsxPresentationToJson } from './PresentationFileConverter';

export const parse = new Map<string, (path: string) => SinglePresentation>([
	['json', (path: string) => JSON.parse(`${fs.readFileSync(path)}`)],
	[
		'xlsx',
		(path: string) => convertXlsxPresentationToJson(xlsx.readFile(path)),
	],
]);
