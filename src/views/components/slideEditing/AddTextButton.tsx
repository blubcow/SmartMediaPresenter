import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { TextFields } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IAddTextButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const AddTextButton: React.FC<IAddTextButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<TextFields
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('addTxt')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default AddTextButton;
