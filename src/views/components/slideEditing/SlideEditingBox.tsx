import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { ActionIdentifier } from '../../../reducers/PresentationEditingReducer';
import { MediaRessource, Slide } from '../../../shared/types/presentation';
import SlideBox from '../SlideBox';

interface ISlideEditingBoxProps {}

const SlideEditingBox: React.FC<ISlideEditingBoxProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const {
		presentation,
		currentSlide,
		activeMedia,
		editingControls,
		editingBoxDimensions,
	} = state;

	const onFileReceived = (file: File, id: number) => {
		// @ts-ignore: path available trough electron
		const url = 'file://' + file.path;
		const currentMedia = presentation.slides[currentSlide].media.filter(
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

		const newSlides = presentation.slides.filter(
			(slide) => slide.id !== currentSlide
		);

		dispatch({
			type: ActionIdentifier.presentationSettingsUpdated,
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
						type: ActionIdentifier.editingMediaStarted,
						payload: { activeMedia: id },
					});
				}}
				onSelectedMediaBlur={() =>
					dispatch({
						type: ActionIdentifier.editingSlideStated,
					})
				}
				mediaBoxesCanReceiveMedia
				onSizeChanged={(width: number, height: number) => {
					dispatch({
						type: ActionIdentifier.editingBoxDimensionsUpdated,
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
