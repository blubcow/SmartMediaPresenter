import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Rotate90DegreesCcw } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IRotateButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {}

const RotateButton: React.FC<IRotateButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Rotate90DegreesCcw
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('rotate')}</EditButtonLabel>}
			{...props}
		/>
	);
};

export default RotateButton;
