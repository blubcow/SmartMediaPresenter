import React from 'react';
import EditingButton from './EditingButton';
import { OndemandVideo } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IAutoPlaybackButtonProps {}

const AutoPlaybackButton: React.FC<IAutoPlaybackButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<OndemandVideo
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('autoPlayback')}</EditButtonLabel>}
			selected={false}
			{...props}
		/>
	);
};

export default AutoPlaybackButton;
