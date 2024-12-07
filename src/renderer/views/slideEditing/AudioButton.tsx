import { Audiotrack } from '@mui/icons-material';
import { Popover } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalFileSystem, usePresentationEditingContext } from '../../hooks';
import { i18nNamespace } from '../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../shared/identifiers.enum';
import RemoteFileExplorer from '../media/RemoteFileExplorer';
import AudioPlaybackContent from './audio/AudioPlaybackContent';
import OptionContent from './audio/OptionContent';
import RecordAudioContent from './audio/RecordAudioContent';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';
import { useAudioButtonStyles } from './styles';

interface IAudioButtonProps {}

const AudioButton: React.FC<IAudioButtonProps> = (props) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;

	const [anchorElement, setAnchorElement] = useState<
		HTMLDivElement | undefined
	>(undefined);
	const [recordAudioSelected, setRecordAudioSelected] =
		useState<boolean>(false);
	const [openRemoteFileExplorer, setOpenRemoteFileExplorer] =
		useState<boolean>(false);

	const { openFileSelectorDialog } = useLocalFileSystem();

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
				secondaryNode={<EditableCaptionText>{t('addAudio')}</EditableCaptionText>}
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
					<AudioPlaybackContent />
				) : recordAudioSelected ? (
					<RecordAudioContent />
				) : (
					<OptionContent
						onInsertClicked={async () => {
							const files: any[] = await openFileSelectorDialog('audio');
							if (files.length > 0) {
								const file = files[0];
								const newPresentation = JSON.parse(
									JSON.stringify(presentation)
								);
								newPresentation.slides[currentSlide] = {
									...newPresentation.slides[currentSlide],
									audio: { location: file.location },
									playback: 'audio',
								};

								dispatch({
									type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
									payload: { presentation: newPresentation },
								});
							}
						}}
						onRecordClicked={() => setRecordAudioSelected(true)}
						onCloudClicked={() => setOpenRemoteFileExplorer(true)}
					/>
				)}
			</Popover>
			{openRemoteFileExplorer && (
				<RemoteFileExplorer
					open={true}
					filterItems='audio'
					onClose={() => setOpenRemoteFileExplorer(false)}
					onMediaChoosen={(url) => {
						const newPresentation = JSON.parse(JSON.stringify(presentation));
						newPresentation.slides[currentSlide] = {
							...newPresentation.slides[currentSlide],
							audio: { location: { remote: url } },
							playback: 'audio',
						};

						dispatch({
							type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
							payload: { presentation: newPresentation },
						});
						setOpenRemoteFileExplorer(false);
					}}
				/>
			)}
		</>
	);
};

export default AudioButton;
