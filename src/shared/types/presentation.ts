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
	audio?: AudioRessource;
	playback?: 'audio' | number;
	elements?: SlideElement[];
}

export interface SlideSettings {
	color?: string;
	presentationFrame?: PresentationFrameSettings;
	notes?: string;
}

export interface MediaRessource {
	id: number;
	location: MediaLocation;
	settings?: Partial<MediaSettings>;
}

export interface AudioRessource {
	location: MediaLocation;
}

export interface MediaSettings {
	translation: MediaTranslation;
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

export interface MediaTranslation {
	rel: { width: number; height: number };
	x: number;
	y: number;
}

export interface Dimensions {
	height: number;
	width: number;
}

export interface PresentationFrameSettings {
	rel: Dimensions;
	top: number;
	left: number;
	right: number;
	bottom: number;
}

export type SlideElementType = 'text';

export interface SlideElement {
	id: number;
	position: { x: number; y: number };
	type: SlideElementType;
}

export type TextAlignment = 'left' | 'right' | 'center';

export type TextStyle = 'normal' | 'italic';

export interface TextElement extends SlideElement {
	text: string;
	size: number;
	fontFamily?: string;
	color?: string;
	weight?: number;
	alignment: TextAlignment;
	style: TextStyle;
}
