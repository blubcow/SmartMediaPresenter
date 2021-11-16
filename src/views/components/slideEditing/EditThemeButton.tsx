import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { ColorLens } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IEditThemeButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const EditThemeButton: React.FC<IEditThemeButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<ColorLens
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('editTheme')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default EditThemeButton;
