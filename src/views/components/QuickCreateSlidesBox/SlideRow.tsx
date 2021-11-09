import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useSlideRowStyles } from './styles';
import { Slide } from '../../../shared/types/presentation';
import SlideRowMediaHolder from './SlideRowMediaHolder';

const SlideRow = (props: {
	slide: Slide;
	active: boolean;
	onClick: () => void;
	onMediaReceived: (slideId: number, mediaId: number, path: string) => void;
}) => {
	const { slide, active, onClick, onMediaReceived } = props;

	const classes = useSlideRowStyles();

	return (
		<Box
			className={classes.container}
			sx={{
				border: active ? '1px solid' : 'none',
				minHeight: `${60 * slide.rows}px`,
				maxHeight: `${60 * slide.rows}px`,
				height: `${60 * slide.rows}px`,
				borderColor: 'primary.main',
			}}
			onClick={onClick}
		>
			{slide.media.map((media) => (
				<SlideRowMediaHolder
					id={media.id}
					src={media.location.local ?? media.location.remote}
					width={`${100 / slide.media.length}%`}
					onMediaReceived={(id, path) => {
						onMediaReceived(slide.id, id, path);
					}}
				/>
			))}
		</Box>
	);
};

export default SlideRow;
