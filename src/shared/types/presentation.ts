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
	settings?: SlideSettings;
}

export interface SlideSettings {
	color?: string;
}

export interface MediaRessource {
	id: number;
	location: MediaLocation;
	settings?: Partial<MediaSettings>;
}

export interface MediaSettings {
	transformation: MediaTransformation;
	scaling: MediaScaleing;
	rotation: number;
	brightness: number;
	saturation: number;
	hue: number;
	contrast: number;
	grayScale: number;
	sepia: number;
	blur: number;
}

export interface MediaTransformation {
	x: number;
	y: number;
}

export interface MediaScaleing {
	x: number;
	y: number;
}

export interface ImageManipulationEntity {
	name: string;
	property: string;
	range: { from: number; to: number };
	value: number;
	unit: '%' | 'px' | 'deg';
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
