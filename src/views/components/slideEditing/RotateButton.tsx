import React, { useState } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Rotate90DegreesCcw } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { Box, TextField, Card } from '../../../smpUI/components';
import MediaEditingModal from './MediaEditingModal';
import {
	MediaRessource,
	MediaSettings,
} from '../../../shared/types/presentation';

interface IRotateButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	mediaResource?: MediaRessource;
	onMediaSettingsChanged: (settings: Partial<MediaSettings>) => void;
}

const RotateButton: React.FC<IRotateButtonProps> = (props) => {
	const { mediaResource, onMediaSettingsChanged } = props;
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [rotationValue, setRotationValue] = useState<string>('');
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<>
			<EditingButton
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
					const prevTransformation = mediaResource?.settings?.rotation ?? 0;
					const currentTransformation = parseFloat(rotationValue);

					onMediaSettingsChanged({
						...mediaResource?.settings,
						rotation: isNaN(currentTransformation)
							? prevTransformation
							: currentTransformation + (prevTransformation % 360),
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
