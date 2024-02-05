import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text } from '../../../smpUI/components';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import {
	MediaRessource,
	SinglePresentation,
	Slide,
} from '../../../shared/types/presentation';
import SlideBox from '../SlideBox';
import { useHeldKeys } from '../../../hooks/useHeldKeys';

interface ISlideEditingBoxProps { }

const SlideEditingBox: React.FC<ISlideEditingBoxProps> = (props) => {
	const { state, dispatch, dispatchMediaTranslationTransformation } =
		usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia, editingControls, waitForSecondActiveMedia, secondActiveMedia } = state;
	const { shift } = useHeldKeys();
	const [dragToSwapId, setDragToSwapId] = useState<number | undefined>();

	useEffect(() => {
		if (activeMedia === undefined) return;

		const handleKeyPress = (e: KeyboardEvent) => {
			const key = e.key;

			if (key === '+' || key === '-') {
				const newPresentation = JSON.parse(JSON.stringify(presentation));
				const scaleSettings = newPresentation.slides[currentSlide].media[
					activeMedia
				].settings?.scaling ?? { x: 1, y: 1 };

				const mediaResource = JSON.parse(
					JSON.stringify(
						newPresentation.slides[currentSlide].media[activeMedia]
					)
				);

				mediaResource.settings = {
					...mediaResource.settings,
					scaling: {
						x: scaleSettings.x * (key === '+' ? 1.01 : 0.99),
						y: scaleSettings.y * (key === '+' ? 1.01 : 0.99),
					},
				};

				newPresentation.slides[currentSlide].media[activeMedia] = mediaResource;

				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: { presentation: newPresentation },
				});
			} else if (key.startsWith('Arrow')) {
				dispatchMediaTranslationTransformation(
					(e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) *
					(shift ? 5 : 1),
					(e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0) *
					(shift ? 5 : 1)
				);
			}
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

	const onRemoteUrlReceived = useCallback(
		(
			url: string,
			id: number,
			presentation: SinglePresentation,
			currentSlide: number
		) => {
			const newPresentation: SinglePresentation = JSON.parse(
				JSON.stringify(presentation)
			);
			newPresentation.slides[currentSlide].media[id].location = { remote: url };
			dispatch({
				type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
				payload: { presentation: newPresentation },
			});
		},
		[]
	);

	return (
		<>
			<SlideBox
				slide={presentation.slides[currentSlide]}
				theme={{ ...presentation.theme }}
				didReceiveMediaFile={onFileReceived}
				didReceiveRemoteMediaUrl={(url, id) =>
					onRemoteUrlReceived(url, id, presentation, currentSlide)
				}
				activeMedia={activeMedia}
				secondActiveMedia={secondActiveMedia}
				onActivateMedia={(id: number) => {
					// Select second image
					if (waitForSecondActiveMedia) {
						// Abort if same image is selected
						if(activeMedia == id) {
							alert('Same image is not allowed');
							return;
						}
						dispatch({
							type: PresentationEditingActionIdentifiers.selectSecondMedia,
							payload: { secondActiveMedia: id },
						});
					} else {
						dispatch({
							type: PresentationEditingActionIdentifiers.editingMediaStarted,
							payload: { activeMedia: id },
						});
					}
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
						payload: {
							editingBoxDimensions: { width: width, height: height },
						},
					});
				}}
				presentationFrameEditingEnabled={
					editingControls === 'presentationFrame'
				}
				overflowEnabled={
					editingControls === 'presentationFrame' ||
					editingControls === 'media' ||
					editingControls === 'text'
				}
				dragToSwapEnabled={
					editingControls === 'slide' || editingControls === 'media'
				}
				onDragToSwapStarted={(id) => {
					setDragToSwapId(id);
				}}
				onSwapped={(id) => {
					if (dragToSwapId === undefined) return;
					const media: MediaRessource[] = [
						...presentation.slides[currentSlide].media,
					]
						.map((media) => ({
							...media,
							id:
								media.id === id
									? dragToSwapId
									: media.id === dragToSwapId
										? id
										: media.id,
						}))
						.sort((a, b) => (a.id > b.id ? 1 : -1));

					const newPresentation = { ...presentation };
					newPresentation.slides[currentSlide].media = media;
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
				}}
				editableText
			/>

			<Box sx={{ width: '100%', paddingLeft: 1 }}>
				<Text>{`${currentSlide + 1}/${presentation.slides.length}`}</Text>
			</Box>
		</>
	);
};

export default SlideEditingBox;
