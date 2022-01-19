import React, { useState } from 'react';
import {
	Slide,
	MediaRessource,
	getEmptySlide,
} from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import SlideBox from '../SlideBox';
import useStyles from './styles';
import HeaderRow from './HeaderRow';
import SlideRow from './SlideRow';
import MultiInsertion from './MultiInsertion';
import { DataTransferIdentifiers } from '../../../types/identifiers';

interface IQuickCreateSlidesBoxProps {
	slides: Slide[];
	onSlidesDidChange: (newSlides: Slide[]) => void;
	multiInsertionEnabled: boolean;
}

const QuickCreateSlidesBox: React.FC<IQuickCreateSlidesBoxProps> = (props) => {
	const { slides, onSlidesDidChange, multiInsertionEnabled } = props;

	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const classes = useStyles();

	const fillColumnWithDroppedMedia = (
		column: number,
		event: React.DragEvent<HTMLDivElement>
	) => {
		const slidesForInsert = [...slides];
		let droppedMedia: any[];

		if (
			event.dataTransfer.getData(DataTransferIdentifiers.MultipleMediaFileInfo)
		) {
			droppedMedia = JSON.parse(
				event.dataTransfer.getData(
					DataTransferIdentifiers.MultipleMediaFileInfo
				)
			);
		} else if (
			event.dataTransfer.getData(
				DataTransferIdentifiers.MulitpleRemoteMediaFileInfo
			)
		) {
			droppedMedia = Array.from(
				JSON.parse(
					event.dataTransfer.getData(
						DataTransferIdentifiers.MulitpleRemoteMediaFileInfo
					)
				)
			).map((url) => ({
				location: { remote: url },
			}));
		} else {
			droppedMedia = Array.from(event.dataTransfer.files).map((file) => ({
				// @ts-ignore
				location: { local: 'file://' + file.path },
			}));
		}
		droppedMedia.forEach((droppedMedia) => {
			const slideToInsertIndex = slidesForInsert.findIndex((slide) => {
				const media = slide.media.find((media) => media.id === column);
				return !media || (!media.location.local && !media.location.remote);
			});
			if (slideToInsertIndex !== -1) {
				slidesForInsert[slideToInsertIndex] = {
					...slidesForInsert[slideToInsertIndex],
				};
				slidesForInsert[slideToInsertIndex].media = [
					...slidesForInsert[slideToInsertIndex].media,
				];
				slidesForInsert[slideToInsertIndex].media[column] = {
					...slidesForInsert[slideToInsertIndex].media[column],
					location: droppedMedia.location,
				};
			} else {
				const slide = getEmptySlide();
				slide.id = slidesForInsert.length;
				slide.media[column] = { id: column, location: droppedMedia.location };
				slidesForInsert.push(slide);
			}
			onSlidesDidChange(
				[...slidesForInsert].sort((a, b) => (a.id > b.id ? 1 : -1))
			);
		});
	};

	return (
		<Box className={classes.container}>
			<SlideBox
				className={classes.previewContainer}
				slide={slides[currentSlide]}
				theme={{}}
			/>
			<Box className={classes.slideScrollingContainer}>
				<HeaderRow
					onSlideAdded={() => {
						const newSlide = {
							id: slides.length,
							columns: 2,
							rows: 1,
							media: [
								{ id: 0, location: {} },
								{ id: 1, location: {} },
							],
						};
						onSlidesDidChange([...slides, newSlide]);
						setCurrentSlide(slides.length);
					}}
				/>
				{multiInsertionEnabled ? (
					<MultiInsertion
						onMediaReceived={(col, event) =>
							fillColumnWithDroppedMedia(col, event)
						}
					/>
				) : (
					slides.map((slide) => (
						<SlideRow
							key={slide.id}
							slide={slide}
							active={currentSlide === slide.id}
							onClick={() => {
								setCurrentSlide(slide.id);
							}}
							onMediaReceived={(
								slideId: number,
								mediaId: number,
								path: string
							) => {
								const currentMedia = slides[slideId].media.filter(
									(media) => media.id !== mediaId
								);
								const newMedia: MediaRessource[] = [
									...currentMedia,
									{ id: mediaId, location: { local: path } },
								];
								const slide: Slide = {
									id: slideId,
									rows: 1,
									columns: 2,
									media: [...newMedia].sort((a, b) => (a.id > b.id ? 1 : -1)),
								};

								const newSlides = slides.filter(
									(slide) => slide.id !== slideId
								);

								onSlidesDidChange(
									[...newSlides, slide].sort((a, b) => (a.id > b.id ? 1 : -1))
								);
							}}
						/>
					))
				)}
			</Box>
		</Box>
	);
};

export default QuickCreateSlidesBox;
