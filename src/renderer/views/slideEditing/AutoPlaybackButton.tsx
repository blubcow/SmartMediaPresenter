import { OndemandVideo } from '@mui/icons-material';
import { Popover } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';
import ChoosePlaybackTimeContent from './playback/ChoosePlaybackTimeContent';
import MatchAudioTimeContent from './playback/MatchAudioTimeContent';

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
				secondaryNode={<EditableCaptionText>{t('autoPlayback')}</EditableCaptionText>}
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
