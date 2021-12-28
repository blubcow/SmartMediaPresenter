import xlsx from 'xlsx';
import {
	MediaRessource,
	SinglePresentation,
} from '../../src/shared/types/presentation';

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
		},
		...slideData,
	];
	const sheet = xlsx.utils.json_to_sheet(data);
	const book = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(book, sheet, presentation.name);
	return book;
};
