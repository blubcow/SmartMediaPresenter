import { MediaLocation } from '../shared/presentation.interface';

export interface QuickCreateMediaResource {
	name: string;
	location: MediaLocation;
	added: number;
}
