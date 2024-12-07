import { Crop } from '@mui/icons-material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';
import ImageCroppingModal from './ImageCroppingModal';

interface ICropButtonProps {}

const CropButton: React.FC<ICropButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<EditingButton
				icon={
					<Crop sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
				}
				secondaryNode={<EditableCaptionText>{t('crop')}</EditableCaptionText>}
				selected={open}
				onClick={() => setOpen(true)}
				{...props}
			/>
			<ImageCroppingModal
				open={open}
				onClose={() => setOpen(false)}
				close={() => setOpen(false)}
			/>
		</>
	);
};

export default CropButton;
