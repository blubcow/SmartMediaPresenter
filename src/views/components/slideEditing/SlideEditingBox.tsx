import React, { useEffect } from 'react';
import { Box, Text } from '../../../smpUI/components';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { MediaRessource, Slide } from '../../../shared/types/presentation';
import SlideBox from '../SlideBox';
import { useHeldKeys } from '../../../hooks/useHeldKeys';

interface ISlideEditingBoxProps {}

const SlideEditingBox: React.FC<ISlideEditingBoxProps> = (props) => {
	const { state, dispatch, dispatchMediaTranslationTransformation } =
		usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia, editingControls } = state;

	const { shift } = useHeldKeys();

	useEffect(() => {
		if (activeMedia === undefined) return;

		const handleKeyPress = (e: KeyboardEvent) => {
			dispatchMediaTranslationTransformation(
				(e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) *
					(shift ? 5 : 1),
				(e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0) *
					(shift ? 5 : 1)
			);
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => document.removeEventListener('keydown', handleKeyPress);
	}, [
		currentSlide,
		activeMedia,
		presentation.slides[currentSlide].media,
		shift,
	]);

	const onFileReceived = (file: File, id: number) => {
		// @ts-ignore: path available trough electron
		const url = 'file://' + file.path;
		const currentMedia = presentation.slides[currentSlide].media.filter(
			(media: MediaRessource) => media.id !== id
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

		const newSlides = presentation.slides.filter(
			(slide: Slide) => slide.id !== currentSlide
		);

		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: {
				presentation: {
					...presentation,
					slides: [...newSlides, slide].sort((a, b) => (a.id > b.id ? 1 : -1)),
				},
			},
		});
	};

	return (
		<>
			<SlideBox
				slide={presentation.slides[currentSlide]}
				didReceiveMediaFile={onFileReceived}
				activeMedia={activeMedia}
				onActivateMedia={(id: number) => {
					dispatch({
						type: PresentationEditingActionIdentifiers.editingMediaStarted,
						payload: { activeMedia: id },
					});
				}}
				onSelectedMediaBlur={() =>
					dispatch({
						type: PresentationEditingActionIdentifiers.editingSlideStated,
					})
				}
				onSlideBackgroundClicked={() =>
					dispatch({
						type: PresentationEditingActionIdentifiers.editingSlideStated,
					})
				}
				mediaBoxesCanReceiveMedia
				onSizeChanged={(width: number, height: number) => {
					dispatch({
						type: PresentationEditingActionIdentifiers.editingBoxDimensionsUpdated,
						payload: { editingBoxDimensions: { width: width, height: height } },
					});
				}}
				presentationFrameEditingEnabled={
					editingControls === 'presentationFrame'
				}
				overflowEnabled={
					editingControls === 'presentationFrame' || editingControls === 'media'
				}
			/>
			<Box sx={{ width: '100%', paddingLeft: 1 }}>
				<Text>{`${currentSlide + 1}/${presentation.slides.length}`}</Text>
			</Box>
		</>
	);
};

export default SlideEditingBox;
