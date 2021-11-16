import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Crop54 } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IEditPresentationFrameProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const EditPresentationFrame: React.FC<IEditPresentationFrameProps> = (
	props
) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Crop54 sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
			}
			secondaryNode={<EditButtonLabel>{t('editPresFrame')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default EditPresentationFrame;
