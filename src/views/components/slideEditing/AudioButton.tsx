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
import AudioPlaybackContent from './audioComponents/AudioPlaybackContent';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import RemoteFileExplorer from '../RemoteFileExplorer';

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
