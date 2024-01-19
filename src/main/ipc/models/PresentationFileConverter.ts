import xlsx from 'xlsx';
import {
	MediaRessource,
	SinglePresentation,
	SlideElement,
	TextElement,
} from '../../../renderer/shared/types/presentation';

const mediaToXlsx = (media: MediaRessource[]) => {
	const mediaData = {
		...media.reduce(
			(prev, singleMedia) => ({ ...prev, ...singleMediaToXlsx(singleMedia) }),
			{} as any
		),
	};
	return mediaData;
};

const singleMediaToXlsx = (media?: MediaRessource) => {
	if (!media) return {};
	const data = {} as any;
	data['media-' + media.id + '-location-local'] = media.location.local;
	data['media-' + media.id + '-location-remote'] = media.location.remote;
	data['media-' + media.id + '-settings-translation-rel-width'] =
		media.settings?.translation?.rel?.width;
	data['media-' + media.id + '-settings-translation-rel-height'] =
		media.settings?.translation?.rel?.height;
	data['media-' + media.id + '-settings-translation-x'] =
		media.settings?.translation?.x;
	data['media-' + media.id + '-settings-translation-y'] =
		media.settings?.translation?.y;
	data['media-' + media.id + '-settings-scaleing-x'] =
		media.settings?.scaling?.x;
	data['media-' + media.id + '-settings-scaleing-y'] =
		media.settings?.scaling?.y;
	data['media-' + media.id + '-settings-rotation'] = media.settings?.rotation;
	data['media-' + media.id + '-settings-brightness'] =
		media.settings?.brightness;
	data['media-' + media.id + '-settings-saturation'] =
		media.settings?.saturation;
	data['media-' + media.id + '-settings-hue'] = media.settings?.hue;
	data['media-' + media.id + '-settings-contrast'] = media.settings?.contrast;
	data['media-' + media.id + '-settings-grayscale'] = media.settings?.grayScale;
	data['media-' + media.id + '-settings-sepia'] = media.settings?.sepia;
	data['media-' + media.id + '-settings-blur'] = media.settings?.blur;
	data['media-' + media.id + '-settings-crop-x'] = media.settings?.crop?.x;
	data['media-' + media.id + '-settings-crop-y'] = media.settings?.crop?.y;
	data['media-' + media.id + '-settings-crop-width'] =
		media.settings?.crop?.width;
	data['media-' + media.id + '-settings-crop-height'] =
		media.settings?.crop?.height;
	data['media-' + media.id + '-settings-rgbchannel-red-r'] =
		media.settings?.rgbChannels?.red.r;
	data['media-' + media.id + '-settings-rgbchannel-red-g'] =
		media.settings?.rgbChannels?.red.g;
	data['media-' + media.id + '-settings-rgbchannel-red-b'] =
		media.settings?.rgbChannels?.red.b;
	data['media-' + media.id + '-settings-rgbchannel-red-alpha'] =
		media.settings?.rgbChannels?.red.alpha;
	data['media-' + media.id + '-settings-rgbchannel-green-r'] =
		media.settings?.rgbChannels?.red.r;
	data['media-' + media.id + '-settings-rgbchannel-green-g'] =
		media.settings?.rgbChannels?.green.g;
	data['media-' + media.id + '-settings-rgbchannel-green-b'] =
		media.settings?.rgbChannels?.green.b;
	data['media-' + media.id + '-settings-rgbchannel-green-alpha'] =
		media.settings?.rgbChannels?.green.alpha;
	data['media-' + media.id + '-settings-rgbchannel-blue-r'] =
		media.settings?.rgbChannels?.blue.r;
	data['media-' + media.id + '-settings-rgbchannel-blue-g'] =
		media.settings?.rgbChannels?.blue.g;
	data['media-' + media.id + '-settings-rgbchannel-blue-b'] =
		media.settings?.rgbChannels?.blue.b;
	data['media-' + media.id + '-settings-rgbchannel-blue-alpha'] =
		media.settings?.rgbChannels?.blue.alpha;
	data['media-' + media.id + '-settings-alignment'] = media.settings?.alignment;
	return data;
};

const elementsToXlsx = (elements?: SlideElement[]) => {
	if (elements === undefined) return {};
	return elements.reduce((prev, element) => {
		let data;
		switch (element.type) {
			case 'text':
				data = convertTextElementToXlsx(element as TextElement);
				break;
			default:
				data = {};
		}
		return { ...prev, ...data };
	}, {} as any);
};

const convertTextElementToXlsx = (element: TextElement) => {
	const data: any = {};
	data[`element-${element.id}-position-rel-width`] = element.position.rel.width;
	data[`element-${element.id}-position-rel-height`] =
		element.position.rel.height;
	data[`element-${element.id}-position-x`] = element.position.x;
	data[`element-${element.id}-position-y`] = element.position.y;
	data[`element-${element.id}-type`] = element.type;
	data[`element-${element.id}-text`] = element.text;
	data[`element-${element.id}-size-rel`] = element.size.rel;
	data[`element-${element.id}-size-font`] = element.size.font;
	data[`element-${element.id}-fontFamily`] = element.fontFamily;
	data[`element-${element.id}-color`] = element.color;
	data[`element-${element.id}-alignment`] = element.alignment;
	data[`element-${element.id}-italic`] = element.italic ? 't' : 'f';
	data[`element-${element.id}-bold`] = element.bold ? 't' : 'f';
	data[`element-${element.id}-font`] = element.font;
	return data;
};

export const convertJsonToXlsx = (
	presentation: SinglePresentation
): xlsx.WorkBook => {
	const slideData = presentation.slides.map((slide) => ({
		id: slide.id,
		rows: slide.rows,
		columns: slide.columns,
		media: slide.media.length,
		'settings-color': slide.settings?.color,
		'settings-presentationframe-rel-width':
			slide.settings?.presentationFrame?.rel?.width,
		'settings-presentationframe-rel-height':
			slide.settings?.presentationFrame?.rel?.height,
		'settings-presentationframe-left': slide.settings?.presentationFrame?.left,
		'settings-presentationframe-right':
			slide.settings?.presentationFrame?.right,
		'settings-presentationframe-top': slide.settings?.presentationFrame?.top,
		'settings-presentationframe-bottom':
			slide.settings?.presentationFrame?.bottom,
		'settings-notes': slide.settings?.notes,
		'audio-location-local': slide.audio?.location?.local,
		'audio-location-remote': slide.audio?.location?.remote,
		playback: slide.playback,
		...mediaToXlsx(slide.media),
		elements: (slide.elements ?? []).length,
		...elementsToXlsx(slide.elements),
	}));
	const data = [
		{
			name: presentation.name,
			lastChanges: presentation.lastChanges,
			'theme-defaultformat-rows': presentation.theme?.defaultFormat?.rows,
			'theme-defaultformat-columns': presentation.theme?.defaultFormat?.columns,
			'theme-defaultbackgroundcolor':
				presentation.theme?.defaultBackgroundColor,
			'theme-audio-local': presentation.theme?.audio?.local,
			'theme-audio-remote': presentation.theme?.audio?.remote,
			'theme-defaultplaybackduration':
				presentation.theme?.defaultPlaybackDuration,
			'theme-defaultfontsize': presentation.theme?.defaultFontSize,
			'theme-defaultfont': presentation.theme?.defaultFont,
			'theme-defaultfontcolor': presentation.theme?.defaultFontColor,
			'theme-defaultmediaalignment': presentation.theme?.defaultMediaAlignment,
		},
		...slideData,
	];
	const sheet = xlsx.utils.json_to_sheet(data);
	const book = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(book, sheet, presentation.name);
	return book;
};

const convertTextElementToJson = (slide: any, elementId: number) => {
	return {
		id: elementId,
		position:
			slide[`element-${elementId}-position-rel-width`] !== undefined
				? {
						rel: {
							width: slide[`element-${elementId}-position-rel-width`],
							height: slide[`element-${elementId}-position-rel-height`],
						},
						x: slide[`element-${elementId}-position-x`],
						y: slide[`element-${elementId}-position-y`],
				  }
				: undefined,
		type: 'text',
		text: slide[`element-${elementId}-text`],
		size:
			slide[`element-${elementId}-size-rel`] !== undefined
				? {
						rel: slide[`element-${elementId}-size-rel`],
						font: slide[`element-${elementId}-size-font`],
				  }
				: undefined,
		fontFamily: slide[`element-${elementId}-fontFamily`],
		color: slide[`element-${elementId}-color`],
		alignment: slide[`element-${elementId}-alignment`],
		italic: slide[`element-${elementId}-italic`] === 't',
		bold: slide[`element-${elementId}-bold`] === 't',
		font: slide[`element-${elementId}-font`],
	};
};

const convertSlidesFromXlsxToJson = (slides: any[]) => {
	return slides.map((slide: any) => ({
		id: slide.id,
		rows: slide.rows,
		columns: slide.columns,
		audio:
			slide['audio-location-local'] || slide['audio-location-remote']
				? {
						location: {
							local: slide['audio-location-local'],
							remote: slide['audio-location-remote'],
						},
				  }
				: undefined,
		playback: slide.playback,
		settings: {
			color: slide['settings-color'],
			notes: slide['settings-notes'],
			presentationFrame:
				slide['settings-presentationframe-top'] !== undefined
					? {
							rel: {
								width: slide['settings-presentationframe-rel-width'],
								height: slide['settings-presentationframe-rel-height'],
							},
							top: slide['settings-presentationframe-top'],
							left: slide['settings-presentationframe-left'],
							right: slide['settings-presentationframe-right'],
							bottom: slide['settings-presentationframe-bottom'],
					  }
					: undefined,
		},
		media: Array.from(
			{ length: (slide['media'] as number) ?? 0 },
			() => null
		).map((_, id) => ({
			id: id,
			location: {
				local: slide['media-' + id + '-location-local'],
				remote: slide['media-' + id + '-location-remote'],
			},
			settings: {
				translation:
					slide['media-' + id + '-settings-translation-x'] !== undefined
						? {
								rel: {
									width:
										slide['media-' + id + '-settings-translation-rel-width'],
									height:
										slide['media-' + id + '-settings-translation-rel-height'],
								},
								x: slide['media-' + id + '-settings-translation-x'],
								y: slide['media-' + id + '-settings-translation-y'],
						  }
						: undefined,
				scaling:
					slide['media-' + id + '-settings-scaleing-x'] !== undefined
						? {
								x: slide['media-' + id + '-settings-scaleing-x'] ?? 1,
								y: slide['media-' + id + '-settings-scaleing-y'] ?? 1,
						  }
						: undefined,
				rotation: slide['media-' + id + '-settings-rotation'],
				brightness: slide['media-' + id + '-settings-brightness'],
				saturation: slide['media-' + id + '-settings-saturation'],
				hue: slide['media-' + id + '-settings-hue'],
				contrast: slide['media-' + id + '-settings-contast'],
				grayScale: slide['media-' + id + '-settings-grayscale'],
				sepia: slide['media-' + id + '-settings-sepia'],
				blur: slide['media-' + id + '-settings-blur'],
				crop:
					slide['media-' + id + '-settings-crop-x'] !== undefined
						? {
								x: slide['media-' + id + '-settings-crop-x'],
								y: slide['media-' + id + '-settings-crop-y'],
								width: slide['media-' + id + '-settings-crop-width'],
								height: slide['media-' + id + '-settings-crop-height'],
						  }
						: undefined,
				rgbChannels:
					slide['media-' + id + '-settings-rgbchannel-red-r'] !== undefined
						? {
								red: {
									r: slide['media-' + id + '-settings-rgbchannel-red-r'],
									g: slide['media-' + id + '-settings-rgbchannel-red-g'],
									b: slide['media-' + id + '-settings-rgbchannel-red-b'],
									alpha:
										slide['media-' + id + '-settings-rgbchannel-red-alpha'],
								},
								green: {
									r: slide['media-' + id + '-settings-rgbchannel-green-r'],
									g: slide['media-' + id + '-settings-rgbchannel-green-g'],
									b: slide['media-' + id + '-settings-rgbchannel-green-b'],
									alpha:
										slide['media-' + id + '-settings-rgbchannel-green-alpha'],
								},
								blue: {
									r: slide['media-' + id + '-settings-rgbchannel-blue-r'],
									g: slide['media-' + id + '-settings-rgbchannel-blue-g'],
									b: slide['media-' + id + '-settings-rgbchannel-blue-b'],
									alpha:
										slide['media-' + id + '-settings-rgbchannel-blue-alpha'],
								},
						  }
						: undefined,
				alignment: slide['media-' + id + '-settings-alignment'],
			},
		})),
		elements: Array.from({ length: slide.elements }, () => null).map(
			(_, id) => {
				let data;
				switch (slide['element-' + id + '-type']) {
					case 'text':
						data = convertTextElementToJson(slide, id);
						break;
					default:
						data = {};
				}
				return {
					...data,
				};
			}
		),
	}));
};

export const convertXlsxPresentationToJson = (pres: xlsx.WorkBook) => {
	const sheet = xlsx.utils.sheet_to_json(pres.Sheets[pres.SheetNames[0]]);

	const presentationInfo: any = sheet[0];
	const presentationTheme = {
		defaultFormat:
			presentationInfo['theme-defaultformat-rows'] !== undefined
				? {
						rows: presentationInfo['theme-defaultformat-rows'],
						columns: presentationInfo['theme-defaultformat-columns'],
				  }
				: undefined,
		defaultBackgroundColor: presentationInfo['theme-defaultbackgroundcolor'],
		audio: presentationInfo['theme-audio'],
		defaultPlaybackDuration: presentationInfo['theme-defaultplaybackduration'],
		defaultFontSize: presentationInfo['theme-defaultfontsize'],
		defaultFont: presentationInfo['theme-defaultfont'],
		defaultFontColor: presentationInfo['theme-defaultfontcolor'],
		defaultMediaAlignment: presentationInfo['theme-defaultmediaalignment'],
	};

	const slides = sheet.slice(1);

	const json = {
		name: presentationInfo.name,
		lastChanges: presentationInfo.lastChanges,
		theme: presentationTheme,
		slides: convertSlidesFromXlsxToJson(slides),
	};

	return json;
};
