import React, { useState } from 'react';
import EditingButton from './EditingButton';
import { Popover } from '../../../smpUI/components';
import { Audiotrack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import { useAudioButtonStyles } from './styles';
import OptionContent from './audioComponents/OptionContent';
import RecordAudioContent from './audioComponents/RecordAudioContent';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';

interface IAudioButtonProps {}

const AudioButton: React.FC<IAudioButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;

	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);
	const [recordAudioSelected, setRecordAudioSelected] =
		useState<boolean>(false);

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		setRecordAudioSelected(false);
		setAnchorElement(e.currentTarget);
	};
	const handleClose = () => setAnchorElement(undefined);

	const classes = useAudioButtonStyles();

	return (
		<>
			<EditingButton
				icon={
					<Audiotrack
						sx={{
							color: 'text.primary',
							height: '100%',
							width: '100%',
						}}
					/>
				}
				highlighted={presentation.slides[currentSlide].audio !== undefined}
				secondaryNode={<EditButtonLabel>{t('addAudio')}</EditButtonLabel>}
				selected={!!anchorElement}
				onClick={handleClick}
				{...props}
			/>
			<Popover
				className={classes.popover}
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
			>
				{presentation.slides[currentSlide].audio ? (
					<></>
				) : recordAudioSelected ? (
					<RecordAudioContent />
				) : (
					<OptionContent
						onInsertClicked={() => {}}
						onRecordClicked={() => setRecordAudioSelected(true)}
					/>
				)}
			</Popover>
		</>
	);
};

export default AudioButton;
