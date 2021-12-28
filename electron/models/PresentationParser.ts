import * as fs from 'fs';
import { SinglePresentation } from '../../src/shared/types/presentation';

export const parse = new Map<string, (path: string) => SinglePresentation>([
	['json', (path: string) => JSON.parse(`${fs.readFileSync(path)}`)],
]);
