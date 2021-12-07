import React, { useState, useEffect } from 'react';
import EditingButton from './EditingButton';
import { Popover } from '../../../smpUI/components';
import { OndemandVideo } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import ChoosePlaybackTimeContent from './playbackComponents/ChoosePlaybackTimeContent';
import MatchAudioTimeContent from './playbackComponents/MatchAudioTimeContent';

interface IAutoPlaybackButtonProps {}

const AutoPlaybackButton: React.FC<IAutoPlaybackButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;

	const [overridingEnabled, setOverridingEnabled] = useState<boolean>(false);
	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);

	const handleClose = () => {
		setAnchorElement(undefined);
	};

	useEffect(() => {
		if (!anchorElement) return;

		setOverridingEnabled(false);
	}, [anchorElement]);

	return (
		<>
			<EditingButton
				highlighted={presentation.slides[currentSlide].playback !== undefined}
				icon={
					<OndemandVideo
						sx={{ color: 'text.primary', height: '100%', width: '100%' }}
					/>
				}
				secondaryNode={<EditButtonLabel>{t('autoPlayback')}</EditButtonLabel>}
				selected={!!anchorElement}
				onClick={(e) => {
					setAnchorElement(e.currentTarget);
				}}
				{...props}
			/>
			<Popover
				open={!!anchorElement}
				onClose={handleClose}
				anchorEl={anchorElement}
			>
				{presentation.slides[currentSlide].playback === 'audio' &&
				!overridingEnabled ? (
					<MatchAudioTimeContent
						onEnableOverriding={() => setOverridingEnabled(true)}
					/>
				) : (
					<ChoosePlaybackTimeContent
						onClose={() => {
							if (presentation.slides[currentSlide].playback !== 'audio')
								handleClose();
						}}
					/>
				)}
			</Popover>
		</>
	);
};

export default AutoPlaybackButton;
