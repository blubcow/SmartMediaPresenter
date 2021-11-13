import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { SinglePresentation, Slide } from '../../../shared/types/presentation';
import {
	Box,
	FloatingButton,
	FloatingButtonContainer,
	Text,
} from '../../../smpUI/components';
import SlideEditingBox from '../SlideEditingBox';
import useStyles from './styles';
import {
	Edit,
	Slideshow,
	Delete,
	ArrowLeft,
	ArrowRight,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../../shared/types/routes';
import { CircularProgress } from '@mui/material';

interface IPresentationPreviewProps {
	presentation?: SinglePresentation;
	id: number;
}

const PresentationPreview: React.FC<IPresentationPreviewProps> = (props) => {
	const { presentation, id } = props;

	const [currentSlide, setCurrentSlide] = useState<number>(0);

	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const history = useHistory();

	return (
		<Box className={classes.container}>
			<FloatingButtonContainer>
				{presentation && presentation.slides.length > 0 && (
					<FloatingButton variant='extended' color='primary'>
						<Slideshow sx={{ mr: 1 }} />
						{t('startPresentation')}
					</FloatingButton>
				)}
				<FloatingButton
					variant='extended'
					color='primary'
					onClick={() => {
						history.push(`${SMPRoutes.Edit}?id=${id}`);
					}}
				>
					<Edit sx={{ mr: 1 }} />
					{t('edit')}
				</FloatingButton>
				<FloatingButton variant='extended' color='secondary'>
					<Delete sx={{ mr: 1 }} />
					{t('delete')}
				</FloatingButton>
			</FloatingButtonContainer>
			<Box className={classes.topContainer}>
				<Text variant='h4'>{presentation?.name}</Text>
			</Box>

			{presentation ? (
				presentation.slides.length ? (
					<Preview slide={presentation.slides[currentSlide]} />
				) : (
					<Text variant='h6'>{t('presentationIsEmpty')}</Text>
				)
			) : (
				<CircularProgress variant='indeterminate' />
			)}

			<Box className={classes.bottomContainer}>
				{presentation && presentation.slides.length > 0 && (
					<>
						<FloatingButton
							sx={{ opacity: currentSlide === 0 ? 0 : 1 }}
							disabled={currentSlide === 0}
							onClick={() => setCurrentSlide((curr) => Math.max(0, curr - 1))}
						>
							<ArrowLeft />
						</FloatingButton>
						<FloatingButton
							sx={{
								opacity:
									currentSlide == presentation!.slides.length - 1 ? 0 : 1,
							}}
							disabled={currentSlide == presentation!.slides.length - 1}
							onClick={() => {
								setCurrentSlide((curr) =>
									Math.min(currentSlide + 1, presentation!.slides.length - 1)
								);
							}}
						>
							<ArrowRight />
						</FloatingButton>
					</>
				)}
			</Box>
		</Box>
	);
};

interface IPreviewProps {
	slide: Slide;
}

const Preview: React.FC<IPreviewProps> = (props) => {
	const { slide } = props;

	return <SlideEditingBox slide={slide} />;
};

export default PresentationPreview;
