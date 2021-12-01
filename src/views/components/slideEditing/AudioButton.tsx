import React from 'react';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { Audiotrack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';

interface IAudioButtonProps {}

const AudioButton: React.FC<IAudioButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	return (
		<EditingButton
			icon={
				<Audiotrack
					sx={{ color: 'text.primary', height: '100%', width: '100%' }}
				/>
			}
			secondaryNode={<EditButtonLabel>{t('addAudio')}</EditButtonLabel>}
			selected={false}
			{...props}
		/>
	);
};

export default AudioButton;
