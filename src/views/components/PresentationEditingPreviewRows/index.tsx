import React, { useState } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { getEmptySlide, Slide } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import { SlidePreviewRow, SlidesHeaderRow } from '../rows';
import useStyles from './styles';
import LazyLoad from 'react-lazyload';

interface IPresentationEditingPreviewRows {}

const PresentationEditingPreviewRows: React.FC<
	IPresentationEditingPreviewRows
> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const classes = useStyles();
	const [draggedSlide, setDraggedSlide] = useState<Slide | undefined>();

	return (
		<Box className={classes.slidesContainer}>
			<Box className={classes.rowsScrollingContainer}>
				<SlidesHeaderRow
					addNewSlide={() => {
						dispatch({
							type: PresentationEditingActionIdentifiers.editingSlideStated,
						});
						const newSlideId = currentSlide + 1;
						const newSlide = getEmptySlide(
							newSlideId,
							presentation.theme?.defaultFormat
						);
						const newPresentation = { ...presentation };
						newPresentation.slides = [
							...presentation.slides.slice(0, newSlideId),
							newSlide,
							...presentation.slides
								.slice(newSlideId)
								.map((slide) => ({ ...slide, id: slide.id + 1 })),
						];

						const newInitialSlides = [
							...state.initialSlides.slice(0, newSlideId),
							JSON.parse(JSON.stringify(newSlide)),
							...state.initialSlides
								.slice(newSlideId)
								.map((slide) => ({ ...slide, id: slide.id + 1 })),
						];

						dispatch({
							type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
							payload: {
								presentation: newPresentation,
								initialSlides: newInitialSlides,
							},
						});
						dispatch({
							type: PresentationEditingActionIdentifiers.changeCurrentSlide,
							payload: { currentSlide: newSlide.id },
						});
					}}
				/>
				{presentation.slides.map((slide: Slide, i: number) => (
					<LazyLoad once>
						<SlidePreviewRow
							key={i}
							slide={slide}
							selected={currentSlide === i}
							onSelected={(id: number) => {
								dispatch({
									type: PresentationEditingActionIdentifiers.editingSlideStated,
								});
								dispatch({
									type: PresentationEditingActionIdentifiers.changeCurrentSlide,
									payload: { currentSlide: id },
								});
							}}
							onDragStarted={(slide: Slide) => {
								setDraggedSlide(slide);
							}}
							onDraggedOverSwap={(slideId: number) => {
								if (slideId === draggedSlide!.id || !draggedSlide) return;
								const draggedId = draggedSlide.id;
								setDraggedSlide({ ...draggedSlide!, id: slideId });
								const newSlides = presentation.slides
									.map((slide: Slide) => ({
										...slide,
										id:
											slide.id === slideId
												? draggedId
												: slide.id === draggedId
												? slideId
												: slide.id,
									}))
									.sort((a: Slide, b: Slide) => (a.id > b.id ? 1 : -1));
								const newPresentation = { ...presentation };
								newPresentation.slides = newSlides;
								dispatch({
									type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
									payload: { presentation: newPresentation },
								});
							}}
						/>
					</LazyLoad>
				))}
			</Box>
		</Box>
	);
};

export default PresentationEditingPreviewRows;
