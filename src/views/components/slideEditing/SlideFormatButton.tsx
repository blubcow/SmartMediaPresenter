import React from 'react';
import EditingButton from './EditingButton';
import { GridView } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface ISlideFormatButtonProps {}

const SlideFormatButton: React.FC<ISlideFormatButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<GridView
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('changeFormat')}</EditButtonLabel>}
			selected={false}
			{...props}
		/>
	);
};

export default SlideFormatButton;
