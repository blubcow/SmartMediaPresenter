import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { TextFields } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IAddTextButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const AddTextButton: React.FC<IAddTextButtonProps> = (props) => {
	const { dispatch } = usePresentationEditingContext();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<TextFields
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('addTxt')}</EditButtonLabel>}
			onClick={() => {
				dispatch({
					type: PresentationEditingActionIdentifiers.editingTextStarted,
				});
			}}
			{...props}
		/>
	);
};

export default AddTextButton;
