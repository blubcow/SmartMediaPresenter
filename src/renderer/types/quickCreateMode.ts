import { MediaLocation } from '../shared/types/presentation';

export interface QuickCreateMediaResource {
	name: string;
	location: MediaLocation;
	added: number;
}
