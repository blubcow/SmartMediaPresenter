export interface StoredPresentation {
	id: number;
	name: string;
	created: number;
	remoteId?: string;
	remoteUpdate?: number;
}

export interface StoredPresentations {
	count: number;
	presentations: StoredPresentation[];
}

export interface SinglePresentation {
	name: string;
	lastChanges: number;
	remoteId?: string;
	remoteUpdate?: number;
	slides: Slide[];
	theme?: SlideTheme;
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
	crop: MediaCrop;
	rgbChannels: MediaRGBChannels;
	alignment: MediaAlignment;
}

export interface RGBChannel {
	r: number;
	g: number;
	b: number;
	alpha: number;
}

export interface MediaRGBChannels {
	red: RGBChannel;
	green: RGBChannel;
	blue: RGBChannel;
}

export interface MediaCrop {
	x: number;
	y: number;
	width: number;
	height: number;
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

export const getEmptySlide = (
	id?: number,
	format?: { rows: number; columns: number }
): Slide => {
	return {
		id: id ?? 0,
		columns: format?.columns ?? 2,
		rows: format?.rows ?? 1,
		media: Array.from(
			{ length: (format?.columns ?? 2) * (format?.rows ?? 1) },
			(_, i) => ({ id: i, location: {} })
		),
	};
};

export type MediaAlignment = TextAlignment | 'auto';

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
	position: MediaTranslation;
	type: SlideElementType;
}

export type TextAlignment = 'left' | 'right' | 'center';

export interface TextElement extends SlideElement {
	text: string;
	size: { rel: number; font: number };
	fontFamily?: string;
	color: string;
	alignment: TextAlignment;
	italic: boolean;
	bold: boolean;
	font: string;
}

export interface SlideTheme {
	defaultFormat?: { rows: number; columns: number };
	defaultBackgroundColor?: string;
	audio?: MediaLocation;
	defaultPlaybackDuration?: number;
	defaultFontSize?: number;
	defaultFont?: string;
	defaultFontColor?: string;
	defaultMediaAlignment?: MediaAlignment;
}
