import React, { useState, useEffect } from 'react';
import EditingButton from './EditingButton';
import { AspectRatio } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { Box, TextField, Card } from '../../../smpUI/components';
import MediaEditingModal from './MediaEditingModal';
import { MediaRessource } from '../../../shared/types/presentation';
import { Link, LinkOff } from '@mui/icons-material';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IScaleButtonProps {}

const ScaleButton: React.FC<IScaleButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const mediaResource: MediaRessource =
		presentation.slides[currentSlide].media[activeMedia ?? 0];
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [scaleValue, setScaleValue] = useState<{ x: string; y: string }>({
		x: '1',
		y: '1',
	});
	const [uniformScaling, setUniformScaling] = useState<boolean>(true);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		if (uniformScaling) setScaleValue({ ...scaleValue, y: scaleValue.x });
	}, [uniformScaling]);

	return (
		<>
			<EditingButton
				selected={openModal}
				icon={
					<AspectRatio
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('scale')}</EditButtonLabel>}
				onClick={() => {
					setOpenModal(true);
					setScaleValue({ x: '1', y: '1' });
				}}
				{...props}
			/>
			<MediaEditingModal
				title={t('scale')}
				open={openModal}
				onEditingFinished={() => {
					if (activeMedia === undefined) return;

					const prevTransformation = mediaResource?.settings?.scaling ?? {
						x: 1,
						y: 1,
					};
					const currentTransformation = {
						x: parseFloat(scaleValue.x ?? 1),
						y: parseFloat(scaleValue.y ?? 1),
					};

					const mediaSettings = { ...mediaResource.settings };
					mediaSettings.scaling = {
						x: isNaN(currentTransformation.x)
							? prevTransformation.x ?? 1
							: (prevTransformation.x ?? 1) * currentTransformation.x,
						y: isNaN(currentTransformation.y)
							? prevTransformation.y ?? 1
							: (prevTransformation.y ?? 1) * currentTransformation.y,
					};

					const newPresentation = { ...presentation };
					newPresentation.slides[currentSlide].media[activeMedia].settings =
						mediaSettings;
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});

					setOpenModal(false);
					setScaleValue({ x: '', y: '' });
				}}
				onCancel={() => setOpenModal(false)}
				onClose={() => setOpenModal(false)}
				content={
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Card
							elevation={10}
							sx={{
								padding: 1,
								width: '40px',
								height: '40px',
								bgcolor: 'background.paper',
								cursor: 'pointer',
							}}
							onClick={() => setUniformScaling((curr) => !curr)}
						>
							<Box sx={{ width: '100%', height: '100%' }}>
								{uniformScaling ? (
									<Link
										sx={{
											color: 'text.primary',
											width: '100%',
											height: '100%',
										}}
									/>
								) : (
									<LinkOff
										sx={{
											color: 'text.primary',
											width: '100%',
											height: '100%',
										}}
									/>
								)}
							</Box>
						</Card>
						<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
							<TextField
								label='x'
								value={scaleValue.x}
								sx={{ width: '30%' }}
								onChange={(e) => {
									const val = e.target.value;

									setScaleValue({
										x: val,
										y: uniformScaling ? val : scaleValue.y,
									});
								}}
							/>
							<TextField
								label='y'
								value={scaleValue.y}
								sx={{ width: '30%' }}
								onChange={(e) => {
									const val = e.target.value;
									setScaleValue({
										y: val,
										x: uniformScaling ? val : scaleValue.x,
									});
								}}
							/>
						</Box>
					</Box>
				}
			/>
		</>
	);
};

export default ScaleButton;
