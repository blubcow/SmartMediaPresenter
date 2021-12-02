import React, { useState } from 'react';
import EditingButton from './EditingButton';
import { Box, Popover } from '../../../smpUI/components';
import { Audiotrack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { useAudioButtonStyles } from './styles';
import OptionContent from './audioComponents/OptionContent';

interface IAudioButtonProps {}

const AudioButton: React.FC<IAudioButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		setAnchorElement(e.currentTarget);
	};
	const handleClose = () => setAnchorElement(undefined);
	const classes = useAudioButtonStyles();

	return (
		<>
			<EditingButton
				icon={
					<Audiotrack
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('addAudio')}</EditButtonLabel>}
				selected={false}
				onClick={handleClick}
				{...props}
			/>
			<Popover
				className={classes.popover}
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
			>
				<OptionContent onInsertClicked={() => {}} onRecordClicked={() => {}} />
			</Popover>
		</>
	);
};

export default AudioButton;
