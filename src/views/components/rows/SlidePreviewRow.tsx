import React, { useRef, useEffect } from 'react';
import {
	MediaLocation,
	MediaRessource,
	Slide,
} from '../../../shared/types/presentation';
import { Row, Box, Text } from '../../../smpUI/components';
import { IRowProps } from '../../../smpUI/components/Row';

interface ISlidePreviewRowProps extends IRowProps {
	slide: Slide;
	onSelected: (id: number) => void;
	selected: boolean;
	onDragStarted: (slide: Slide) => void;
	onDraggedOverSwap: (id: number) => void;
}

const SlidePreviewRow: React.FC<ISlidePreviewRowProps> = (props) => {
	const { slide, onSelected, selected, onDragStarted, onDraggedOverSwap } =
		props;
	const ref = useRef<any>();

	useEffect(() => {
		if (
			selected &&
			ref.current?.getBoundingClientRect().bottom > window.innerHeight
		)
			ref.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
	}, [selected]);

	return (
		<>
			<Row
				{...props}
				draggable
				sx={{
					height: '100px',
					border: selected ? '2px solid' : 0,
					borderColor: 'primary.main',
				}}
				onClick={() => {
					onSelected(slide.id);
				}}
				onDragStart={() => {
					onDragStarted(slide);
				}}
				onDragOver={(e) => {
					e.preventDefault();
					// if (e.clientX)
					onDraggedOverSwap(slide.id);
				}}
			>
				<PreviewRow height='100%' items={slide.media} />
			</Row>
			<div ref={ref} />
		</>
	);
};

const ImagePreview = (props: { width: string; location?: MediaLocation }) => {
	const { width, location } = props;

	return (
		<Box
			sx={{
				width: width,
				aspectRatio: '16/9',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				padding: 0.1,
			}}
		>
			{location?.local || location?.remote ? (
				<img
					draggable={false}
					src={location?.local ?? location?.remote}
					style={{ height: '100%', width: '100%' }}
				/>
			) : (
				<Box
					sx={{
						height: '100%',
						width: '100%',
						bgcolor: 'divider',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Text variant='caption'>no media</Text>
				</Box>
			)}
		</Box>
	);
};

const PreviewRow = (props: { height: string; items: MediaRessource[] }) => {
	const { height, items } = props;
	return (
		<Box style={{ height: height, display: 'flex', cursor: 'pointer' }}>
			{items.map((item, i) => (
				<ImagePreview
					width={`${100 / items.length}%`}
					location={items.find((item) => item.id === i)?.location}
					key={i}
				/>
			))}
		</Box>
	);
};

export default SlidePreviewRow;
