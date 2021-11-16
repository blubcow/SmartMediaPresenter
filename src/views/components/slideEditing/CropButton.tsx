import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Crop } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface ICropButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const CropButton: React.FC<ICropButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Crop sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
			}
			secondaryNode={<EditButtonLabel>{t('crop')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default CropButton;
