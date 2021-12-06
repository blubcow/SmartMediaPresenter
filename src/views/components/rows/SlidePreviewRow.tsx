import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
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
					height: `${slide.rows * 100}px`,
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
				{Array.apply(null, Array(slide.rows)).map((_, i) => (
					<Box
						key={i}
						sx={{
							display: 'flex',
							flexDirection: 'row',
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
							maxHeight: `${100 / slide.rows}%`,
						}}
					>
						<PreviewRow
							height='100%'
							items={[...slide.media].slice(
								i * slide.columns,
								i * slide.columns + slide.columns
							)}
						/>
					</Box>
				))}
			</Row>
			<div ref={ref} />
		</>
	);
};

const ImagePreview = (props: { width: string; location?: MediaLocation }) => {
	const { width, location } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

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
					style={{ height: '100%', width: '100%', objectFit: 'contain' }}
					alt='media'
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
					<Text variant='caption'>{t('noMedia')}</Text>
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
