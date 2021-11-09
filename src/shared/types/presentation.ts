export interface StoredPresentation {
	id: number;
	name: string;
	created: number;
}

export interface StoredPresentations {
	count: number;
	presentations: StoredPresentation[];
}

export interface SinglePresentation {
	name: string;
	lastChanges: number;
	slides: Slide[];
}

export interface Slide {
	id: number;
	rows: number;
	columns: number;
	media: MediaRessource[];
}

export interface MediaRessource {
	id: number;
	location: MediaLocation;
}

export interface MediaLocation {
	local?: string;
	remote?: string;
}

export const getEmptySlide = (id?: number): Slide => {
	return {
		id: id ?? 0,
		columns: 2,
		rows: 1,
		media: [
			{ id: 0, location: {} },
			{ id: 1, location: {} },
		],
	};
};
