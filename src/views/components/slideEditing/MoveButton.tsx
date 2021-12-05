import React, { useState } from 'react';
import EditingButton from './EditingButton';
import { Transform } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import MediaEditingModal from './MediaEditingModal';
import { Box, TextField } from '../../../smpUI/components';
import { MediaRessource } from '../../../shared/types/presentation';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';

interface IMoveButtonProps {}

const MoveButton: React.FC<IMoveButtonProps> = (props) => {
	const { state, dispatchMediaTranslationTransformation } =
		usePresentationEditingContext();
	const { presentation, currentSlide, activeMedia } = state;
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
					dispatchMediaTranslationTransformation(
						isNaN(parseInt(moveValue.x)) ? 0 : parseInt(moveValue.x),
						isNaN(parseInt(moveValue.y)) ? 0 : parseInt(moveValue.y)
					);
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
