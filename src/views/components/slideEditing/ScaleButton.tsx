import React, { useState } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { AspectRatio } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { Box, TextField, Card } from '../../../smpUI/components';
import MediaEditingModal from './MediaEditingModal';
import {
	MediaRessource,
	MediaSettings,
} from '../../../shared/types/presentation';
import { Link, LinkOff } from '@mui/icons-material';

interface IScaleButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	mediaResource?: MediaRessource;
	onMediaSettingsChanged: (settings: Partial<MediaSettings>) => void;
}

const ScaleButton: React.FC<IScaleButtonProps> = (props) => {
	const { mediaResource, onMediaSettingsChanged } = props;
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [scaleValue, setScaleValue] = useState<{ x: number; y: number }>({
		x: 1,
		y: 1,
	});
	const [uniformScaling, setUniformScaling] = useState<boolean>(true);
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<>
			<EditingButton
				icon={
					<AspectRatio
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('scale')}</EditButtonLabel>}
				onClick={() => setOpenModal(true)}
				{...props}
			/>
			<MediaEditingModal
				title={t('scale')}
				open={openModal}
				onEditingFinished={() => {
					const prevTransformation = mediaResource?.settings?.scaling ?? {
						x: 1,
						y: 1,
					};
					const currentTransformation = {
						x: scaleValue.x ?? 1,
						y: scaleValue.y ?? 1,
					};

					onMediaSettingsChanged({
						...mediaResource?.settings,
						scaling: {
							x: (prevTransformation.x ?? 1) * currentTransformation.x,
							y: (prevTransformation.y ?? 1) * currentTransformation.y,
						},
					});
					setOpenModal(false);
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
									const val =
										e.target.value === '-' ? -0 : parseFloat(e.target.value);

									setScaleValue({
										x: isNaN(val) ? 1 : val,
										y: uniformScaling ? (isNaN(val) ? 1 : val) : scaleValue.y,
									});
								}}
							/>
							<TextField
								label='y'
								value={scaleValue.y}
								sx={{ width: '30%' }}
								onChange={(e) => {
									const val =
										e.target.value === '-' ? -0 : parseFloat(e.target.value);
									setScaleValue({
										y: isNaN(val) ? 1 : val,
										x: uniformScaling ? (isNaN(val) ? 1 : val) : scaleValue.x,
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
