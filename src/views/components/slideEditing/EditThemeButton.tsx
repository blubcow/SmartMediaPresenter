import React, { useState } from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { ColorLens } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import EditThemeDrawer from './EditThemeDrawer';

interface IEditThemeButtonProps {}

const EditThemeButton: React.FC<IEditThemeButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<EditingButton
				icon={
					<ColorLens
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('editTheme')}</EditButtonLabel>}
				onClick={() => setOpen(true)}
				selected={open}
			/>
			<EditThemeDrawer open={open} onClose={() => setOpen(false)} />
		</>
	);
};

export default EditThemeButton;
