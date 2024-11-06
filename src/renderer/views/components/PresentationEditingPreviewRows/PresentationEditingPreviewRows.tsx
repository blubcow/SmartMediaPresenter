import React, { useEffect, useRef, useState } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import { getEmptySlide, Slide } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import { SlidePreviewRow, SlidesHeaderRow } from '../rows';
import useStyles from './styles';

interface IPresentationEditingPreviewRows {}

const PresentationEditingPreviewRows: React.FC<
	IPresentationEditingPreviewRows
> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const classes = useStyles();
	const [draggedSlide, setDraggedSlide] = useState<Slide | undefined>();
	const root = useRef(null);
	const [visibilityWindow, setVisibilityWindow] = useState<{
		start: number;
		end: number;
	}>({ start: 0, end: 49 });

	let [visibility, setVisibility] = useState<number>(0);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const ids = entries
					.filter((entry) => entry.isIntersecting)
					.map((entry) =>
						parseInt(
							entry.target.attributes.getNamedItem('data-id')?.value ?? '-1'
						)
					);
				if (ids.length === 0) return;

				setVisibility(ids[ids.length - 1]);

				if (ids.includes(visibilityWindow.end)) {
					const add = Math.min(
						25,
						presentation.slides.length - visibilityWindow.end
					);
					setVisibilityWindow((curr) => ({
						start: curr.start,
						end: curr.end + add,
					}));
				}
			},
			{ threshold: 1 }
		);

		document.querySelectorAll('#slide').forEach((element) => {
			observer.observe(element);
		});

		return () => observer.disconnect();
	}, [visibilityWindow]);

	return (
		<Box className={classes.slidesContainer} ref={root}>
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
				{presentation.slides
					.slice(visibilityWindow.start, visibilityWindow.end + 1)
					.map((slide: Slide, i: number) => (
						<SlidePreviewRow
							id='slide'
							data-id={i}
							key={i}
							slide={slide}
							isVisible={visibility - 20 <= i && visibility + 20 >= i}
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
								// Check if we are dragging a slide (Other elements can be dragged over)
								if(draggedSlide != undefined){
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
								}
							}}
						/>
					))}
			</Box>
		</Box>
	);
};

export default PresentationEditingPreviewRows;
