import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { AspectRatio } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IScaleButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const ScaleButton: React.FC<IScaleButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<AspectRatio
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('scale')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default ScaleButton;
