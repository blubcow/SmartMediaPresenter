import React, { useState, useEffect } from 'react';
import { Page } from '../../smpUI/layout';
import {
	Box,
	Text,
	FloatingButton,
	FloatingButtonContainer,
} from '../../smpUI/components';
import { useLocation } from 'react-router-dom';
import { useSinglePresentation } from '../../hooks/useMainProcessMethods';
import EditTopBar from './EditTopBar';
import useStyles from './styles';
import { Divider } from '@mui/material';
import {
	Dimensions,
	MediaRessource,
	PresentationFrameSettings,
	Slide,
	SlideSettings,
} from '../../shared/types/presentation';
import { Save, Slideshow, Check, Close } from '@mui/icons-material';
import PresentationFullScreen from '../components/FullScreen/PresentationFullScreen';
import { useFullScreenHandle } from 'react-full-screen';
import { SlidesHeaderRow, SlidePreviewRow } from '../components/rows';
import SlideEditingBox from '../components/SlideEditingBox';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { SavedPresentationSuccess } from '../components/Alerts/SavedPresentation';

const Edit: React.FC<{}> = (props) => {
	const [id, setId] = useState<string>('');
	const location = useLocation();
	const { storedPresentation, saveChanges } = useSinglePresentation(
		parseInt(id)
	);
	const classes = useStyles();
	const [slides, setSlides] = useState<Slide[]>([]);
	const [currentSlide, setCurrentSlide] = useState<number>(0);

	const [currentMedia, setCurrentMedia] = useState<MediaRessource[]>([]);
	const [draggedSlide, setDraggedSlide] = useState<Slide | undefined>();
	const [activeMedia, setActiveMedia] = useState<number | undefined>(undefined);
	const handle = useFullScreenHandle();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [slideEditingBoxDimensions, setSlideEditingBoxDimensions] =
		useState<Dimensions>({ width: 0, height: 0 });
	const [
		savedPresentationSuccessAlertOpen,
		setSavedPresentationSuccessAlertOpen,
	] = useState<boolean>(false);
	const [presentationFrameEditingEnabled, setPresentationFrameEditingEnabled] =
		useState<boolean>(false);
	const [
		currentPresentationFrameSettings,
		setCurrentPresentationFrameSettings,
	] = useState<PresentationFrameSettings | undefined>();

	useEffect(() => {
		const currentSlides: Slide[] = storedPresentation?.slides ?? [];

		if (currentSlides.length === 0)
			currentSlides.push({
				id: 0,
				rows: 1,
				columns: 2,
				media: [
					{ id: 0, location: {} },
					{ id: 1, location: {} },
				],
			});

		setCurrentMedia(currentSlides[0].media);
		setSlides([...currentSlides]);
	}, [storedPresentation]);

	useEffect(() => {
		const id = new URLSearchParams(location.search).get('id');
		setId(id ?? '');
	}, [location.search]);

	const onFileReceived = (file: File, id: number) => {
		// @ts-ignore: path available trough electron
		const url = 'file://' + file.path;
		const currentMedia = slides[currentSlide].media.filter(
			(media) => media.id !== id
		);
		const newMedia: MediaRessource[] = [
			...currentMedia,
			{ id: id, location: { local: url } },
		];
		const slide: Slide = {
			id: currentSlide,
			rows: 1,
			columns: 2,
			media: [...newMedia].sort((a, b) => (a.id > b.id ? 1 : -1)),
		};

		const newSlides = slides.filter((slide) => slide.id !== currentSlide);

		setSlides([...newSlides, slide].sort((a, b) => (a.id > b.id ? 1 : -1)));
		setCurrentMedia([...newMedia]);
	};

	const updateSlideSettings = (settings: SlideSettings) => {
		const slide = { ...slides[currentSlide] };
		const newSettings = { ...slide.settings, ...settings };
		slide.settings = newSettings;
		const newSlides = slides.filter((slide) => slide.id !== currentSlide);
		setSlides([...newSlides, slide].sort((a, b) => (a.id > b.id ? 1 : -1)));
	};

	return (
		<Page
			TopBar={
				<EditTopBar
					fileName={storedPresentation?.name}
					currentSlideSettings={
						slides[currentSlide] ? slides[currentSlide].settings : undefined
					}
					slideSettingsDidChange={(settings) => {
						updateSlideSettings(settings);
					}}
					selectedMedia={
						slides[currentSlide] && activeMedia !== undefined
							? slides[currentSlide].media[activeMedia]
							: undefined
					}
					mediaSettingsDidChange={(settings) => {
						if (activeMedia === undefined) return;
						const media = {
							...slides[currentSlide].media[activeMedia],
							settings: settings,
						};

						const currentMedia = slides[currentSlide].media.filter(
							(media) => media.id !== activeMedia
						);
						const newMedia: MediaRessource[] = [...currentMedia, media];
						const slide: Slide = {
							...slides[currentSlide],
							media: [...newMedia].sort((a, b) => (a.id > b.id ? 1 : -1)),
						};

						const newSlides = slides.filter(
							(slide) => slide.id !== currentSlide
						);

						setSlides(
							[...newSlides, slide].sort((a, b) => (a.id > b.id ? 1 : -1))
						);
						setCurrentMedia([...newMedia]);
					}}
					slideEditingBoxDimension={slideEditingBoxDimensions}
					presentationFrameEditingEnabled={presentationFrameEditingEnabled}
					onEditPresentationFrameClicked={() => {
						setPresentationFrameEditingEnabled(true);
					}}
				/>
			}
		>
			<SavedPresentationSuccess
				open={savedPresentationSuccessAlertOpen}
				onClose={() => setSavedPresentationSuccessAlertOpen(false)}
			/>
			{slides.length > 0 && slides[0].media.length > 0 && (
				<PresentationFullScreen handle={handle} slides={slides} />
			)}
			<FloatingButtonContainer>
				{presentationFrameEditingEnabled ? (
					<>
						<FloatingButton
							variant='extended'
							color='primary'
							onClick={() => {
								updateSlideSettings({
									presentationFrame: currentPresentationFrameSettings,
								});
								setPresentationFrameEditingEnabled(false);
							}}
						>
							<Check sx={{ mr: 1 }} />
							{t('confirm')}
						</FloatingButton>
						<FloatingButton
							variant='extended'
							color='secondary'
							onClick={() => {
								setCurrentPresentationFrameSettings(
									slides[currentSlide].settings?.presentationFrame
								);
								setPresentationFrameEditingEnabled(false);
							}}
						>
							<Close sx={{ mr: 1 }} />
							{t('cancel')}
						</FloatingButton>
					</>
				) : (
					<>
						<FloatingButton
							variant='extended'
							color='primary'
							onClick={() => {
								saveChanges({
									name: storedPresentation?.name,
									slides: slides,
								});
								// TODO: evalute wheter or not saving was successful and show accroding alert
								setSavedPresentationSuccessAlertOpen(true);
							}}
						>
							<Save sx={{ mr: 1 }} />
							{t('save')}
						</FloatingButton>
						<FloatingButton
							variant='extended'
							color='primary'
							onClick={handle.enter}
						>
							<Slideshow sx={{ mr: 1 }} />
							{t('startPresentation')}
						</FloatingButton>
					</>
				)}
			</FloatingButtonContainer>
			<Box className={classes.container}>
				<Divider orientation='vertical' />
				<Box className={classes.slidesContainer}>
					<Box className={classes.rowsScrollingContainer}>
						<SlidesHeaderRow
							addNewSlide={() => {
								const newSlide: Slide = {
									id: slides.length,
									rows: 1,
									columns: 2,
									media: [
										{ id: 0, location: {} },
										{ id: 1, location: {} },
									],
								};
								const newSlides: Slide[] = [...slides, newSlide];
								setSlides(newSlides);
								setCurrentMedia(newSlide.media);
								setCurrentSlide(newSlide.id);
							}}
						/>
						{slides.map((slide, i) => (
							<SlidePreviewRow
								key={i}
								slide={slides[i]}
								selected={currentSlide === i}
								onSelected={(id: number) => {
									setCurrentSlide(id);
									const newMedia = slides.find(
										(slide) => slide.id === id
									)?.media;
									setCurrentMedia(newMedia ?? []);
								}}
								onDragStarted={(slide: Slide) => {
									setDraggedSlide(slide);
								}}
								onDraggedOverSwap={(slideId: number) => {
									if (slideId === draggedSlide!.id || !draggedSlide) return;
									const draggedId = draggedSlide.id;
									setDraggedSlide({ ...draggedSlide!, id: slideId });
									const newSlides = slides
										.map((slide) => ({
											...slide,
											id:
												slide.id === slideId
													? draggedId
													: slide.id === draggedId
													? slideId
													: slide.id,
										}))
										.sort((a, b) => (a.id > b.id ? 1 : -1));
									setSlides(newSlides);
								}}
							/>
						))}
					</Box>
				</Box>
				<Divider orientation='vertical' />
				<Box className={classes.previewContainer}>
					{slides[currentSlide] && currentMedia && (
						<>
							<SlideEditingBox
								slide={slides[currentSlide]}
								didReceiveMediaFile={onFileReceived}
								activeMedia={activeMedia}
								onActivateMedia={(id: number) => {
									setActiveMedia(id);
								}}
								onSelectedMediaBlur={() => setActiveMedia(undefined)}
								mediaBoxesCanReceiveMedia
								onSizeChanged={(width: number, height: number) => {
									setSlideEditingBoxDimensions({
										width: width,
										height: height,
									});
								}}
								presentationFrameEditingEnabled={
									presentationFrameEditingEnabled
								}
								onPresentationFrameUpdated={(presentationFrame) => {
									setCurrentPresentationFrameSettings({ ...presentationFrame });
								}}
								overflowEnabled={
									presentationFrameEditingEnabled || activeMedia !== undefined
								}
							/>
							<Box className={classes.slideCounterContainer}>
								<Text>{`${currentSlide + 1}/${slides.length}`}</Text>
							</Box>
						</>
					)}
				</Box>
				<Divider orientation='vertical' />
			</Box>
		</Page>
	);
};

export default Edit;
