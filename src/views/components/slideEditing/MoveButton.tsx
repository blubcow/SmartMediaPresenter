import React, { useState } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Transform } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import MediaEditingModal from './MediaEditingModal';
import { Box, TextField } from '../../../smpUI/components';
import {
	Dimensions,
	MediaRessource,
	MediaSettings,
} from '../../../shared/types/presentation';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IMoveButtonProps {}

const MoveButton: React.FC<IMoveButtonProps> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { editingBoxDimensions, presentation, currentSlide, activeMedia } =
		state;
	const mediaResource: MediaRessource =
		presentation.slides[currentSlide].media[activeMedia ?? 0];
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [moveValue, setMoveValue] = useState<{ x: string; y: string }>({
		x: '',
		y: '',
	});

	return (
		<>
			<EditingButton
				selected={openModal}
				icon={
					<Transform
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('move')}</EditButtonLabel>}
				onClick={() => {
					setMoveValue({ x: '', y: '' });
					setOpenModal(true);
				}}
				{...props}
			/>
			<MediaEditingModal
				title={t('move')}
				open={openModal}
				onEditingFinished={() => {
					if (activeMedia === undefined) return;
					const heightDivider =
						editingBoxDimensions.height /
						(mediaResource?.settings?.translation?.rel.height ??
							editingBoxDimensions.height);
					const widthDivider =
						editingBoxDimensions.width /
						(mediaResource?.settings?.translation?.rel.width ??
							editingBoxDimensions.width);
					const prevTransformation = {
						x: (mediaResource?.settings?.translation?.x ?? 0) * widthDivider,
						y: (mediaResource?.settings?.translation?.y ?? 0) * heightDivider,
					};
					const currentTransformation = {
						x: parseInt(moveValue.x ?? 0),
						y: parseInt(moveValue.y ?? 0),
					};

					const mediaSettings = { ...mediaResource.settings };
					mediaSettings.translation = {
						rel: { ...editingBoxDimensions },
						x: isNaN(currentTransformation.x)
							? prevTransformation.x ?? 0
							: (prevTransformation.x ?? 0) + currentTransformation.x,
						y: isNaN(currentTransformation.y)
							? prevTransformation.y ?? 0
							: (prevTransformation.y ?? 0) - currentTransformation.y,
					};
					const newPresentation = { ...presentation };
					newPresentation.slides[currentSlide].media[activeMedia].settings =
						mediaSettings;
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});

					setOpenModal(false);
				}}
				onCancel={() => setOpenModal(false)}
				onClose={() => setOpenModal(false)}
				content={
					<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
						<TextField
							label='x'
							value={moveValue.x}
							sx={{ width: '30%' }}
							onChange={(e) => {
								setMoveValue({ ...moveValue, x: e.target.value });
							}}
						/>
						<TextField
							label='y'
							value={moveValue.y}
							sx={{ width: '30%' }}
							onChange={(e) => {
								setMoveValue({ ...moveValue, y: e.target.value });
							}}
						/>
					</Box>
				}
			/>
		</>
	);
};

export default MoveButton;
