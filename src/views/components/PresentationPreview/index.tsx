import React, { useState, useEffect } from 'react';
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
	SaveAlt,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../../shared/types/routes';
import { CircularProgress } from '@mui/material';
import PresentationFullScreen from '../FullScreen/PresentationFullScreen';
import { useFullScreenHandle } from 'react-full-screen';
import usePresentationMediaCache from '../../../hooks/usePresentationMediaCache';
import { useDisplays } from '../../../hooks/useMainProcessMethods';
import PresentationMode from '../../PresentationMode';

interface IPresentationPreviewProps {
	presentation?: SinglePresentation;
	id: number;
}

const PresentationPreview: React.FC<IPresentationPreviewProps> = (props) => {
	const { presentation, id } = props;
	const { isLoading, setPresentation } = usePresentationMediaCache();

	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const handle = useFullScreenHandle();
	const presentationModeHandle = useFullScreenHandle();

	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { displaysAvailable, startPresentationMode } = useDisplays();

	const history = useHistory();

	useEffect(() => {
		setPresentation(presentation);
	}, [presentation, setPresentation]);

	return (
		<Box className={classes.container}>
			{presentation &&
				presentation.slides &&
				presentation.slides.length > 0 &&
				!isLoading && (
					<>
						<PresentationFullScreen
							handle={handle}
							slides={presentation?.slides}
						/>
						<PresentationMode
							handle={presentationModeHandle}
							presentation={presentation}
						/>
					</>
				)}
			<FloatingButtonContainer>
				{presentation && presentation.slides.length > 0 && !isLoading && (
					<FloatingButton
						variant='extended'
						color='primary'
						onClick={async () => {
							const c = await displaysAvailable();
							if (c > 1) {
								startPresentationMode(id);
								presentationModeHandle.enter();
							} else {
								handle.enter();
							}
						}}
					>
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
				{presentation && presentation.slides.length > 0 && (
					<FloatingButton variant='extended' color='primary'>
						<SaveAlt sx={{ mr: 1 }} />
						{t('export')}
					</FloatingButton>
				)}
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
					isLoading ? (
						<Box className={classes.loadingContainer}>
							<CircularProgress
								className={classes.fetchingSpinner}
								variant='indeterminate'
							/>
							<Text>{t('fetchingMedia')}</Text>
						</Box>
					) : (
						<Preview slide={presentation.slides[currentSlide]} />
					)
				) : (
					<Text variant='h6'>{t('presentationIsEmpty')}</Text>
				)
			) : (
				<></>
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
									currentSlide === presentation!.slides.length - 1 ? 0 : 1,
							}}
							disabled={currentSlide === presentation!.slides.length - 1}
							onClick={() => {
								setCurrentSlide((curr) =>
									Math.min(currentSlide + 1, presentation!.slides.length - 1)
								);
							}}
						>
							<ArrowRight />
						</FloatingButton>
						{presentation && presentation.slides.length > 0 && (
							<Box className={classes.slidesCounterContainer}>
								<Text variant='body1'>{`${presentation.slides.length} ${t(
									'slides'
								)}`}</Text>
							</Box>
						)}
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

	return (
		<SlideEditingBox slide={slide} presentationFrameEditingEnabled={false} />
	);
};

export default PresentationPreview;
