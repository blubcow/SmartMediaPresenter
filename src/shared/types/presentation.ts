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
