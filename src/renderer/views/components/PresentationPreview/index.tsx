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
} from '../../../smpUI/components';
import SlideBox from '../SlideBox';
import useStyles from './styles';
import {
	Edit,
	Delete,
	ArrowLeft,
	ArrowRight,
	SaveAlt,
	DesktopWindows,
	Cloud,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../../types/routes';
import PresentationFloatingButton from '../PresentationFloatingButton';
import ActionConfirmationModal from '../modals/ActionConfirmationModal';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';
import usePresentationSyncContext from '../../../hooks/usePresentationSyncContext';
import usePresentationCacheContext from '../../../hooks/usePresentationCacheContext';

interface IPresentationPreviewProps {
	presentation?: SinglePresentation;
	id?: number;
	remoteId?: string;
	removePresentationAction: (id: number) => void;
	isCaching: boolean;
	failedToLoad?: number;
}

const PresentationPreview: React.FC<IPresentationPreviewProps> = (props) => {
	const {
		presentation,
		id,
		remoteId,
		removePresentationAction,
		isCaching,
		failedToLoad,
	} = props;

	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const { openSaveFileDialog } = useLocalFileSystem();

	const [localSelected, setLocalSelected] = useState<boolean>(true);
	const [remoteSelected, setRemoteSelected] = useState<boolean>(false);

	const {
		syncingAvailable,
		deleteRemotePresentation,
		removeRemoteAttributesFromPresentation,
	} = usePresentationSyncContext();

	const { unselectLocalPresentation, unselectRemotePresentation } =
		usePresentationCacheContext();

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
				{presentation &&
					presentation.slides &&
					presentation.slides.length > 0 &&
					!isCaching && (
						<PresentationFloatingButton
							presentationId={id}
							remoteId={remoteId}
							presentation={presentation}
						/>
					)}
				{id !== undefined && (
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
				)}

				{presentation && presentation.slides && presentation.slides.length > 0 && (
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
						if (
							id !== undefined &&
							remoteId !== undefined &&
							syncingAvailable
						) {
							if (localSelected) {
								removePresentationAction(id);
								unselectLocalPresentation();
							}
							if (remoteSelected) {
								deleteRemotePresentation(remoteId);
								unselectRemotePresentation();
								if (!localSelected) removeRemoteAttributesFromPresentation(id);
							}
						} else if (id === undefined && remoteId !== undefined) {
							deleteRemotePresentation(remoteId);
							unselectRemotePresentation();
						} else if (remoteId === undefined && id !== undefined) {
							removePresentationAction(id);
							unselectLocalPresentation();
						}
						setOpenDeleteModal(false);
					}}
				>
					{id !== undefined && remoteId !== undefined && syncingAvailable && (
						<Box className={classes.btns}>
							<Box
								className={classes.btn}
								bgcolor={localSelected ? 'primary.main' : undefined}
								onClick={() => setLocalSelected((curr) => !curr)}
							>
								<DesktopWindows
									sx={{ color: 'text.primary', fontSize: '50px' }}
								/>
								<Text fontWeight={700}>{t('local')}</Text>
							</Box>
							<Box
								className={classes.btn}
								bgcolor={remoteSelected ? 'primary.main' : undefined}
								onClick={() => {
									setRemoteSelected((curr) => !curr);
								}}
							>
								<Cloud sx={{ color: 'text.primary', fontSize: '50px' }} />
								<Text fontWeight={700}>{t('cloud')}</Text>
							</Box>
						</Box>
					)}
				</ActionConfirmationModal>
			</FloatingButtonContainer>
			<Box className={classes.topContainer}>
				<Text variant='h4'>{presentation?.name}</Text>
			</Box>
			{presentation ? (
				presentation.slides && presentation.slides.length ? (
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
				{presentation && presentation.slides && presentation.slides.length > 0 && (
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
									currentSlide === presentation!.slides?.length - 1 ? 0 : 1,
							}}
							disabled={currentSlide === presentation!.slides?.length - 1}
							onClick={() => {
								setCurrentSlide((curr) =>
									Math.min(currentSlide + 1, presentation!.slides?.length - 1)
								);
							}}
						>
							<ArrowRight />
						</FloatingButton>
						{presentation && presentation.slides.length > 0 && (
							<Box className={classes.slidesCounterContainer}>
								<Text variant='body1'>{`${presentation.slides?.length} ${t(
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
