import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Tune } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IImageManipulationButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const ImageManipulationButton: React.FC<IImageManipulationButtonProps> = (
	props
) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Tune sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
			}
			secondaryNode={<EditButtonLabel>{t('imgManipulation')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default ImageManipulationButton;
