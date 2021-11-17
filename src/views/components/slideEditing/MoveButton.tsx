import React, { useState } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Transform } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import MediaEditingModal from './MediaEditingModal';
import { Box, TextField } from '../../../smpUI/components';
import {
	MediaRessource,
	MediaSettings,
} from '../../../shared/types/presentation';

interface IMoveButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	mediaResource?: MediaRessource;
	onMediaSettingsChanged: (settings: Partial<MediaSettings>) => void;
}

const MoveButton: React.FC<IMoveButtonProps> = (props) => {
	const { mediaResource, onMediaSettingsChanged } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [moveValue, setMoveValue] = useState<{ x?: number; y?: number }>({});

	return (
		<>
			<EditingButton
				icon={
					<Transform
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('move')}</EditButtonLabel>}
				onClick={() => setOpenModal(true)}
				{...props}
			/>
			<MediaEditingModal
				title={t('move')}
				open={openModal}
				onEditingFinished={() => {
					const prevTransformation = mediaResource?.settings
						?.transformation ?? { x: 0, y: 0 };
					const currentTransformation = {
						x: moveValue.x ?? 0,
						y: moveValue.y ?? 0,
					};

					onMediaSettingsChanged({
						...mediaResource?.settings,
						transformation: {
							x: (prevTransformation.x ?? 0) + currentTransformation.x,
							y: (prevTransformation.y ?? 0) + currentTransformation.y,
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
								setMoveValue({ ...moveValue, x: parseInt(e.target.value) });
							}}
						/>
						<TextField
							label='y'
							value={moveValue.y}
							sx={{ width: '30%' }}
							onChange={(e) => {
								setMoveValue({ ...moveValue, y: parseInt(e.target.value) });
							}}
						/>
					</Box>
				}
			/>
		</>
	);
};

export default MoveButton;
