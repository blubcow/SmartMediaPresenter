import React, { useState } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { ActionIdentifier } from '../../../reducers/PresentationEditingReducer';
import { getEmptySlide, Slide } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import { SlidePreviewRow, SlidesHeaderRow } from '../rows';
import useStyles from './styles';

interface IPresentationEditingPreviewRows {}

const PresentationEditingPreviewRows: React.FC<IPresentationEditingPreviewRows> =
	() => {
		const { state, dispatch } = usePresentationEditingContext();
		const { presentation, currentSlide } = state;
		const classes = useStyles();
		const [draggedSlide, setDraggedSlide] = useState<Slide | undefined>();

		return (
			<Box className={classes.slidesContainer}>
				<Box className={classes.rowsScrollingContainer}>
					<SlidesHeaderRow
						addNewSlide={() => {
							const newSlide = getEmptySlide(presentation.slides.length);
							const newPresentation = { ...presentation };
							newPresentation.slides.push(newSlide);
							dispatch({
								type: ActionIdentifier.presentationSettingsUpdated,
								payload: { presentation: newPresentation },
							});
							dispatch({
								type: ActionIdentifier.changeCurrentSlide,
								payload: { currentSlide: newSlide.id },
							});
						}}
					/>
					{presentation.slides.map((slide, i) => (
						<SlidePreviewRow
							key={i}
							slide={presentation.slides[i]}
							selected={currentSlide === i}
							onSelected={(id: number) => {
								dispatch({
									type: ActionIdentifier.changeCurrentSlide,
									payload: { currentSlide: id },
								});
								const newMedia = presentation.slides.find(
									(slide) => slide.id === id
								)?.media;
							}}
							onDragStarted={(slide: Slide) => {
								setDraggedSlide(slide);
							}}
							onDraggedOverSwap={(slideId: number) => {
								if (slideId === draggedSlide!.id || !draggedSlide) return;
								const draggedId = draggedSlide.id;
								setDraggedSlide({ ...draggedSlide!, id: slideId });
								const newSlides = presentation.slides
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
								const newPresentation = { ...presentation };
								newPresentation.slides = newSlides;
								dispatch({
									type: ActionIdentifier.presentationSettingsUpdated,
									payload: { presentation: newPresentation },
								});
							}}
						/>
					))}
				</Box>
			</Box>
		);
	};

export default PresentationEditingPreviewRows;
