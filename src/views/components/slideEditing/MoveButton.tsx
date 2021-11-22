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

interface IMoveButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	mediaResource?: MediaRessource;
	onMediaSettingsChanged: (settings: Partial<MediaSettings>) => void;
	slideEditingBoxDimensions: Dimensions;
}

const MoveButton: React.FC<IMoveButtonProps> = (props) => {
	const { mediaResource, onMediaSettingsChanged, slideEditingBoxDimensions } =
		props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [moveValue, setMoveValue] = useState<{ x: string; y: string }>({
		x: '',
		y: '',
	});

	return (
		<>
			<EditingButton
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
					const heightDivider =
						slideEditingBoxDimensions.height /
						(mediaResource?.settings?.translation?.rel.height ??
							slideEditingBoxDimensions.height);
					const widthDivider =
						slideEditingBoxDimensions.width /
						(mediaResource?.settings?.translation?.rel.width ??
							slideEditingBoxDimensions.width);
					const prevTransformation = {
						x: (mediaResource?.settings?.translation?.x ?? 0) * widthDivider,
						y: (mediaResource?.settings?.translation?.y ?? 0) * heightDivider,
					};
					const currentTransformation = {
						x: parseInt(moveValue.x ?? 0),
						y: parseInt(moveValue.y ?? 0),
					};

					onMediaSettingsChanged({
						...mediaResource?.settings,
						translation: {
							rel: { ...slideEditingBoxDimensions },
							x: isNaN(currentTransformation.x)
								? prevTransformation.x ?? 0
								: (prevTransformation.x ?? 0) + currentTransformation.x,
							y: isNaN(currentTransformation.y)
								? prevTransformation.y ?? 0
								: (prevTransformation.y ?? 0) - currentTransformation.y,
						},
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
