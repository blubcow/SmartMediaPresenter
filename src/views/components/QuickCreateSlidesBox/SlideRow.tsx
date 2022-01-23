import React, { useRef, useEffect } from 'react';
import { Box } from '../../../smpUI/components';
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
	const rowRef = useRef<any>();
	const classes = useSlideRowStyles();

	useEffect(() => {
		if (
			active &&
			rowRef.current?.getBoundingClientRect().bottom > window.innerHeight
		)
			rowRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
	}, [active]);

	return (
		<Box
			ref={rowRef}
			className={classes.container}
			sx={{
				outlineStyle: 'solid',
				outlineWidth: active ? '2px' : '0',
				minHeight: `${60 * slide.rows}px`,
				maxHeight: `${60 * slide.rows}px`,
				height: `${60 * slide.rows}px`,
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
