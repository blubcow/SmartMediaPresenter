import { ColorLens } from '@mui/icons-material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';
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
				secondaryNode={<EditableCaptionText>{t('editTheme')}</EditableCaptionText>}
				onClick={() => setOpen(true)}
				selected={open}
			/>
			<EditThemeDrawer
				open={open}
				onClose={() => setOpen(false)}
				onFinish={() => setOpen(false)}
			/>
		</>
	);
};

export default EditThemeButton;
