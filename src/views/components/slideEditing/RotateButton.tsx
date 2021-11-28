import React, { useState } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Rotate90DegreesCcw } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { Box, TextField } from '../../../smpUI/components';
import MediaEditingModal from './MediaEditingModal';
import {
	MediaRessource,
	MediaSettings,
} from '../../../shared/types/presentation';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { ActionIdentifier } from '../../../reducers/PresentationEditingReducer';

interface IRotateButtonProps {}

const RotateButton: React.FC<IRotateButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
	const mediaResource: MediaRessource =
		presentation.slides[currentSlide].media[activeMedia ?? 0];
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [rotationValue, setRotationValue] = useState<string>('');
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<>
			<EditingButton
				selected={openModal}
				icon={
					<Rotate90DegreesCcw
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('rotate')}</EditButtonLabel>}
				onClick={() => {
					setOpenModal(true);
					setRotationValue('');
				}}
				{...props}
			/>
			<MediaEditingModal
				title={t('rotate')}
				open={openModal}
				onEditingFinished={() => {
					if (activeMedia === undefined) return;

					const prevTransformation = mediaResource?.settings?.rotation ?? 0;
					const currentTransformation = parseFloat(rotationValue);

					const mediaSettings = { ...mediaResource.settings };
					mediaSettings.rotation = isNaN(currentTransformation)
						? prevTransformation
						: currentTransformation + (prevTransformation % 360);
					const newPresentation = { ...presentation };
					newPresentation.slides[currentSlide].media[activeMedia].settings =
						mediaSettings;
					dispatch({
						type: ActionIdentifier.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});

					setOpenModal(false);
				}}
				onCancel={() => setOpenModal(false)}
				onClose={() => setOpenModal(false)}
				content={
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<TextField
							label={t('rotate')}
							value={rotationValue}
							sx={{ width: '80%' }}
							onChange={(e) => {
								setRotationValue(e.target.value);
							}}
						/>
					</Box>
				}
			/>
		</>
	);
};

export default RotateButton;
