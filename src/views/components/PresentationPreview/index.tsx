import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import {
	SinglePresentation,
	Slide,
	SlideTheme,
} from '../../../shared/types/presentation';
import {
	Box,
	FloatingButton,
	FloatingButtonContainer,
	Text,
	Button,
} from '../../../smpUI/components';
import SlideBox from '../SlideBox';
import useStyles from './styles';
import {
	Edit,
	Delete,
	ArrowLeft,
	ArrowRight,
	SaveAlt,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../../types/routes';
import PresentationFloatingButton from '../PresentationFloatingButton';
import ActionConfirmationModal from '../modals/ActionConfirmationModal';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';

interface IPresentationPreviewProps {
	presentation?: SinglePresentation;
	id: number;
	removePresentationAction: (id: number) => void;
	isCaching: boolean;
	failedToLoad?: number;
}

const PresentationPreview: React.FC<IPresentationPreviewProps> = (props) => {
	const {
		presentation,
		id,
		removePresentationAction,
		isCaching,
		failedToLoad,
	} = props;

	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const { openSaveFileDialog } = useLocalFileSystem();

	const history = useHistory();

	useEffect(() => {
		setCurrentSlide(0);
	}, [id]);

	useEffect(() => {
		setCurrentSlide(0);
	}, [presentation]);

	return (
		<Box className={classes.container}>
			<FloatingButtonContainer>
				{presentation && presentation.slides.length > 0 && !isCaching && (
					<PresentationFloatingButton
						presentationId={id}
						presentation={presentation}
					/>
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
					<FloatingButton
						variant='extended'
						color='primary'
						onClick={() => {
							openSaveFileDialog(t('savePres'), presentation);
						}}
					>
						<SaveAlt sx={{ mr: 1 }} />
						{t('export')}
					</FloatingButton>
				)}
				<FloatingButton
					variant='extended'
					color='secondary'
					onClick={() => setOpenDeleteModal(true)}
				>
					<Delete sx={{ mr: 1 }} />
					{t('delete')}
				</FloatingButton>
				<ActionConfirmationModal
					secondaryText={t('deletingPresUndoneMsg')}
					open={openDeleteModal}
					onClose={() => setOpenDeleteModal(false)}
					onCancel={() => setOpenDeleteModal(false)}
					onConfirm={() => {
						removePresentationAction(id);
						setOpenDeleteModal(false);
					}}
				/>
			</FloatingButtonContainer>
			<Box className={classes.topContainer}>
				<Text variant='h4'>{presentation?.name}</Text>
			</Box>
			{presentation ? (
				presentation.slides.length ? (
					<Preview
						slide={presentation.slides[currentSlide]}
						theme={{ ...presentation.theme }}
						isCaching={isCaching}
						failedToLoad={failedToLoad}
					/>
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
	theme: SlideTheme;
	isCaching: boolean;
	failedToLoad?: number;
}

const Preview: React.FC<IPreviewProps> = (props) => {
	const { slide, theme, isCaching, failedToLoad } = props;

	return (
		<SlideBox
			slide={slide}
			theme={theme}
			presentationFrameEditingEnabled={false}
			showCachingBadge={isCaching}
			failedToLoad={failedToLoad}
		/>
	);
};

export default PresentationPreview;
