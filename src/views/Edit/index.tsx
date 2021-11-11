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
import { MediaRessource, Slide } from '../../shared/types/presentation';
import { Save, Slideshow } from '@mui/icons-material';
import PresentationFullScreen from '../components/FullScreen/PresentationFullScreen';
import { useFullScreenHandle } from 'react-full-screen';
import { SlidesHeaderRow, SlidePreviewRow } from '../components/rows';
import SlideEditingBox from '../components/SlideEditingBox';

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

	return (
		<Page TopBar={<EditTopBar fileName={storedPresentation?.name} />}>
			{slides.length > 0 && slides[0].media.length > 0 && (
				<PresentationFullScreen handle={handle} slides={slides} />
			)}
			<FloatingButtonContainer>
				<FloatingButton
					variant='extended'
					color='primary'
					onClick={() => {
						saveChanges({
							name: storedPresentation?.name,
							slides: slides,
						});
					}}
				>
					<Save sx={{ mr: 1 }} />
					save
				</FloatingButton>
				<FloatingButton
					variant='extended'
					color='primary'
					onClick={handle.enter}
				>
					<Slideshow sx={{ mr: 1 }} />
					start presentation
				</FloatingButton>
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
