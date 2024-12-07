import { Close } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton, { IEditingButtonProps } from './EditingButton';

interface IRemoveButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const RemoveButton: React.FC<IRemoveButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Close sx={{ color: 'text.primary', height: '100%', width: '100%' }} />
			}
			secondaryNode={<EditableCaptionText>{t('remove')}</EditableCaptionText>}
			{...props}
		/>
	);
};

export default RemoveButton;
