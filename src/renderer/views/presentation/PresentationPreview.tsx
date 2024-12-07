import {
	ArrowLeft,
	ArrowRight,
	Cloud,
	Delete,
	DesktopWindows,
	Edit,
	SaveAlt,
} from '@mui/icons-material';
import { Box, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLocalFileSystem, usePresentationCacheContext, usePresentationSyncContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import {
	SinglePresentation,
} from '../../shared/presentation.interface';
import { SMPRoutes } from '../../shared/routes.enum';
import ActionConfirmationModal from '../modals/ActionConfirmationModal';
import PresentationFloatingButton from './PresentationFloatingButton';
import PreviewSlide from './PreviewSlide';
import { FloatingButtonContainer, FloatingButton, EditableText } from '../../smpUI';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
			position: 'relative',
		},
		topContainer: {
			height: '10%',
			display: 'flex',
			alignItems: 'center',
		},
		middleContainer: {},
		bottomContainer: {
			height: '10%',
			width: '100%',
			display: 'flex',
			alignItems: 'center',
		},
		slidesCounterContainer: {
			marginLeft: theme.spacing(1),
		},
		btns: {
			display: 'flex',
			gap: theme.spacing(3),
			padding: theme.spacing(3),
		},
		btn: {
			padding: theme.spacing(1),
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: theme.spacing(1),
			textAlign: 'center',
			borderRadius: theme.shape.borderRadius,
			transition: 'box-shadow 0.2s ease',
			boxShadow: theme.shadows[5],
			cursor: 'pointer',
			'&:hover': {
				boxShadow: theme.shadows[20],
			},
		},
	})
);


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

	const navigate = useNavigate();

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
							navigate(`${SMPRoutes.Edit}?id=${id}`);
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
								<EditableText fontWeight={700}>{t('local')}</EditableText>
							</Box>
							<Box
								className={classes.btn}
								bgcolor={remoteSelected ? 'primary.main' : undefined}
								onClick={() => {
									setRemoteSelected((curr) => !curr);
								}}
							>
								<Cloud sx={{ color: 'text.primary', fontSize: '50px' }} />
								<EditableText fontWeight={700}>{t('cloud')}</EditableText>
							</Box>
						</Box>
					)}
				</ActionConfirmationModal>
			</FloatingButtonContainer>
			<Box className={classes.topContainer}>
				<EditableText variant='h4'>{presentation?.name}</EditableText>
			</Box>
			{presentation ? (
				presentation.slides && presentation.slides.length ? (
					<PreviewSlide
						slide={presentation.slides[currentSlide]}
						theme={{ ...presentation.theme }}
						isCaching={isCaching}
						failedToLoad={failedToLoad}
					/>
				) : (
					<EditableText variant='h6'>{t('presentationIsEmpty')}</EditableText>
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
								<EditableText variant='body1'>{`${presentation.slides?.length} ${t(
									'slides'
								)}`}</EditableText>
							</Box>
						)}
					</>
				)}
			</Box>
		</Box>
	);
};

export default PresentationPreview;
