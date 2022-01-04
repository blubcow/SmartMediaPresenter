import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../i18n/i18n';
import {
	ImageManipulationEntity,
	MediaRGBChannels,
	MediaSettings,
} from '../shared/types/presentation';

const useImageManipulation = (mediaSettings?: Partial<MediaSettings>) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [options, setOptions] = useState<ImageManipulationEntity[]>([
		{
			name: t('brightness'),
			property: 'brightness',
			range: { from: 0, to: 200 },
			value: mediaSettings?.brightness ?? 100,
			unit: '%',
		},
		{
			name: t('contrast'),
			property: 'contrast',
			range: { from: 0, to: 200 },
			value: mediaSettings?.contrast ?? 100,
			unit: '%',
		},
		{
			name: t('saturation'),
			property: 'saturate',
			range: { from: 0, to: 200 },
			value: mediaSettings?.saturation ?? 100,
			unit: '%',
		},
		{
			name: t('gray scale'),
			property: 'grayscale',
			range: { from: 0, to: 100 },
			value: mediaSettings?.grayScale ?? 0,
			unit: '%',
		},
		{
			name: t('sepia'),
			property: 'sepia',
			range: { from: 0, to: 100 },
			value: mediaSettings?.sepia ?? 0,
			unit: '%',
		},
		{
			name: t('hue'),
			property: 'hue-rotate',
			range: { from: 0, to: 360 },
			value: mediaSettings?.hue ?? 0,
			unit: 'deg',
		},
		{
			name: t('blur'),
			property: 'blur',
			range: { from: 0, to: 20 },
			value: mediaSettings?.blur ?? 0,
			unit: 'px',
		},
	]);
	const defaultChannels = {
		red: { r: 1, g: 0, b: 0, alpha: 0 },
		green: { r: 0, g: 1, b: 0, alpha: 0 },
		blue: { r: 0, g: 0, b: 1, alpha: 0 },
	};
	const [channels, setChannels] = useState<MediaRGBChannels>(
		mediaSettings?.rgbChannels ?? { ...defaultChannels }
	);

	const resetChannels = (callback?: (channels: MediaRGBChannels) => void) => {
		const newChannels = JSON.parse(JSON.stringify(defaultChannels));
		setChannels(newChannels);
		if (callback) callback(newChannels);
	};

	const resetToDefault = (
		callback?: (
			options: ImageManipulationEntity[],
			channels: MediaRGBChannels
		) => void
	) => {
		const newOptions = [...options];
		newOptions[0].value = 100;
		newOptions[1].value = 100;
		newOptions[2].value = 100;
		newOptions[3].value = 0;
		newOptions[4].value = 0;
		newOptions[5].value = 0;
		newOptions[6].value = 0;
		setOptions(newOptions);
		resetChannels((channels) => {
			if (callback) callback(newOptions, channels);
		});
	};

	return {
		options,
		setOptions,
		channels,
		setChannels,
		resetToDefault,
		resetChannels,
	};
};

export default useImageManipulation;
