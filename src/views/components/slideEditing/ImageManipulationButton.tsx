import React, { useState, useEffect } from 'react';
import EditingButton from './EditingButton';
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
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { RestartAlt } from '@mui/icons-material';
import useImageManipulation from '../../../hooks/useImageManipulation';
import RgbChannelsImageManipulationRow from './RgbChannelsImageManipulationRow';
import RgbChannelsPopover from './RgbChannelsPopover';
import ColorChannelFilter from '../MediaBox/ColorChannelFilter';

interface IImageManipulationButtonProps {}

const ImageManipulationButton: React.FC<IImageManipulationButtonProps> = (
	props
) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const mediaResource: MediaRessource =
		presentation.slides[currentSlide].media[activeMedia ?? 0];
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<React.Fragment>
			<EditingButton
				selected={openDrawer}
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
						if (activeMedia === undefined) return;

						const mediaSettings = JSON.parse(JSON.stringify(media.settings));
						const newPresentation = JSON.parse(JSON.stringify(presentation));
						newPresentation.slides[currentSlide].media[activeMedia].settings =
							mediaSettings;
						dispatch({
							type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
							payload: { presentation: newPresentation },
						});

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
	const {
		options,
		setOptions,
		channels,
		setChannels,
		resetToDefault,
		resetChannels,
	} = useImageManipulation(media?.settings);
	const [filter, setFilter] = useState<string>('');
	const [anchorElement, setAnchorElement] = useState<Element | undefined>();

	const classes = useImageManipulationControlsStyles();

	useEffect(() => {
		setFilter(
			options.reduce(
				(prev, option) =>
					`${option.property}(${option.value}${option.unit}) ${prev}`,
				''
			) + `url(#${100})`
		);
	}, [options]);

	return (
		<Box className={classes.container}>
			<Text variant={'h4'}>{heading}</Text>
			<ColorChannelFilter id={100} channels={channels} />
			<img
				className={classes.img}
				src={media?.location.local ?? media?.location.remote}
				style={{
					filter: filter,
				}}
				alt='media'
			/>
			<Button
				color='secondary'
				variant='contained'
				sx={{ marginTop: 1 }}
				onClick={resetToDefault}
			>
				<RestartAlt sx={{ pr: 0.5 }} />
				{t('reset')}
			</Button>
			<Box className={classes.optionsContainer}>
				{options.map((option, index) => (
					<Box key={index} className={classes.optionContainer}>
						<Text fontWeight='bold'>{option.name}</Text>
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
				<RgbChannelsImageManipulationRow
					onClick={(e) => setAnchorElement(e.currentTarget)}
				/>
				<RgbChannelsPopover
					anchorEl={anchorElement}
					onClose={() => setAnchorElement(undefined)}
					channels={channels}
					onChannelsChanged={(mainChannel, subChannel, value) => {
						const newChannels = { ...channels };
						newChannels[mainChannel][subChannel] = value;
						setChannels(newChannels);
					}}
					reset={resetChannels}
				/>
			</Box>

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
							rgbChannels: { ...channels },
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
