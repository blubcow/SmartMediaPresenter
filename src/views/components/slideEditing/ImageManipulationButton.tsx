import React, { useState, useEffect } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Box, Button, Drawer, Text, Slider } from '../../../smpUI/components';
import { Tune } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { useImageManipulationControlsStyles } from './styles';
import {
	ImageManipulationEntity,
	MediaRessource,
	MediaSettings,
} from '../../../shared/types/presentation';

interface IImageManipulationButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	mediaResource?: MediaRessource;
	onMediaSettingsChanged: (settings: Partial<MediaSettings>) => void;
}

const ImageManipulationButton: React.FC<IImageManipulationButtonProps> = (
	props
) => {
	const { mediaResource, onMediaSettingsChanged } = props;
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<React.Fragment>
			<EditingButton
				icon={
					<Tune sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
				}
				secondaryNode={
					<EditButtonLabel>{t('imgManipulation')}</EditButtonLabel>
				}
				{...props}
				onClick={() => setOpenDrawer(true)}
			/>
			<Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
				<ImageManipulationControls
					heading={t('imgManipulation')}
					media={mediaResource}
					onCancel={() => setOpenDrawer(false)}
					onConfrim={(media) => {
						onMediaSettingsChanged({ ...media.settings });
						setOpenDrawer(false);
					}}
				/>
			</Drawer>
		</React.Fragment>
	);
};

interface IImageManipulationControlsProps {
	heading: string;
	media?: MediaRessource;
	onConfrim: (media: MediaRessource) => void;
	onCancel: () => void;
}

const ImageManipulationControls: React.FC<IImageManipulationControlsProps> = (
	props
) => {
	const { heading, media, onConfrim, onCancel } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [options, setOptions] = useState<ImageManipulationEntity[]>([
		{
			name: 'brightness',
			property: t('brightness'),
			range: { from: 0, to: 200 },
			value: media?.settings?.brightness ?? 100,
			unit: '%',
		},
		{
			name: t('contrast'),
			property: 'contrast',
			range: { from: 0, to: 200 },
			value: media?.settings?.contrast ?? 100,
			unit: '%',
		},
		{
			name: t('saturation'),
			property: 'saturate',
			range: { from: 0, to: 200 },
			value: media?.settings?.contrast ?? 100,
			unit: '%',
		},
		{
			name: t('gray scale'),
			property: 'grayscale',
			range: { from: 0, to: 100 },
			value: media?.settings?.grayScale ?? 0,
			unit: '%',
		},
		{
			name: t('sepia'),
			property: 'sepia',
			range: { from: 0, to: 100 },
			value: media?.settings?.sepia ?? 0,
			unit: '%',
		},
		{
			name: t('hue'),
			property: 'hue-rotate',
			range: { from: 0, to: 360 },
			value: media?.settings?.hue ?? 0,
			unit: 'deg',
		},
		{
			name: t('blur'),
			property: 'blur',
			range: { from: 0, to: 20 },
			value: media?.settings?.blur ?? 0,
			unit: 'px',
		},
	]);
	const [filter, setFilter] = useState<string>('');

	const classes = useImageManipulationControlsStyles();

	useEffect(() => {
		setFilter(
			options.reduce(
				(prev, option) =>
					`${option.property}(${option.value}${option.unit}) ${prev}`,
				''
			)
		);
	}, [options]);

	return (
		<Box className={classes.container}>
			<Text variant={'h4'}>{heading}</Text>
			<img
				className={classes.img}
				src={media?.location.local ?? media?.location.remote}
				style={{
					filter: filter,
				}}
			/>
			{options.map((option, index) => (
				<Box key={index} className={classes.optionContainer}>
					<Text variant='h6'>{option.name}</Text>
					<Slider
						className={classes.slider}
						size='small'
						value={option.value}
						min={option.range.from}
						max={option.range.to}
						valueLabelDisplay='auto'
						onChange={(e, val) => {
							// @ts-ignore
							setOptions([
								...options.map((option, i) =>
									index === i ? { ...option, value: val ?? 0 } : option
								),
							]);
						}}
					/>
				</Box>
			))}
			<Box className={classes.btnContainer}>
				<Button variant='contained' color='secondary' onClick={onCancel}>
					{t('cancel')}
				</Button>
				<Button
					variant='contained'
					onClick={() => {
						if (!media) return;
						const newSettings: Partial<MediaSettings> = {
							...media?.settings,
							brightness: options[0].value,
							contrast: options[1].value,
							saturation: options[2].value,
							grayScale: options[3].value,
							sepia: options[4].value,
							hue: options[5].value,
							blur: options[6].value,
						};
						onConfrim({ ...media, settings: newSettings });
					}}
				>
					{t('confirm')}
				</Button>
			</Box>
		</Box>
	);
};

export default ImageManipulationButton;
