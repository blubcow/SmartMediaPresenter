import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IRemoveButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const RemoveButton: React.FC<IRemoveButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Close sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
			}
			secondaryNode={<EditButtonLabel>{t('remove')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default RemoveButton;
