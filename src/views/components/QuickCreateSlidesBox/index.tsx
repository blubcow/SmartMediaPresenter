import React, { useState } from 'react';
import { Slide, MediaRessource } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import SlideEditingBox from '../SlideEditingBox';
import useStyles from './styles';
import HeaderRow from './HeaderRow';
import SlideRow from './SlideRow';

interface IQuickCreateSlidesBoxProps {
	slides: Slide[];
	onSlidesDidChange: (newSlides: Slide[]) => void;
}

const QuickCreateSlidesBox: React.FC<IQuickCreateSlidesBoxProps> = (props) => {
	const { slides, onSlidesDidChange } = props;

	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const classes = useStyles();

	return (
		<Box className={classes.container}>
			<SlideEditingBox
				className={classes.previewContainer}
				slide={slides[currentSlide]}
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
				{slides.map((slide) => (
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

							const newSlides = slides.filter((slide) => slide.id !== slideId);

							onSlidesDidChange(
								[...newSlides, slide].sort((a, b) => (a.id > b.id ? 1 : -1))
							);
							console.log(slides);
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

export default QuickCreateSlidesBox;
