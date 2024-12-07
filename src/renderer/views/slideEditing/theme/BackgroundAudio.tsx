import { Audiotrack, PauseCircle, PlayCircle } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { EditableText } from '../../../smpUI/EditableText';
import RemoteFileExplorer from '../../media/RemoteFileExplorer';
import LocalOrRemoteModal from '../../modals/LocalOrRemoteModal';
import SettingsRow from '../../settings/SettingsRow';
import { usePresentationEditingContext, useRemoteUserContext, useLocalFileSystem } from '../../../hooks';

const BackgroundAudio: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const { userLoggedIn } = useRemoteUserContext();

	const [audioLocation, setAudioLocation] = useState<string | undefined>(
		presentation.theme?.audio?.local ?? presentation.theme?.audio?.remote
	);
	const { openFileSelectorDialog } = useLocalFileSystem();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const [openLocalRemoteSelector, setOpenLocalRemoteSelector] =
		useState<boolean>(false);
	const [openRemoteFileExplorer, setOpenRemoteFileExplorer] =
		useState<boolean>(false);

	const [audio, setAudio] = useState<HTMLAudioElement>(
		new Audio(audioLocation)
	);
	audio.onended = () => setIsPlaying(false);

	useEffect(() => {
		setAudioLocation(
			presentation.theme?.audio?.local ?? presentation.theme?.audio?.remote
		);
	}, [presentation.theme?.audio?.local, presentation.theme?.audio?.remote]);

	useEffect(() => {
		audio.src = audioLocation ?? '';
		audio.onerror = () => {
			if (
				presentation.theme?.audio?.local &&
				presentation.theme?.audio?.remote &&
				audio.src !== presentation.theme?.audio?.remote
			)
				audio.src = presentation.theme?.audio?.remote;
		};
		audio.load();
	}, [audioLocation]);

	const handleSelectLocal = useCallback(async () => {
		const files: any[] = await openFileSelectorDialog('audio');
		if (files.length > 0) {
			const newPresentation = JSON.parse(JSON.stringify(presentation));
			newPresentation.theme = {
				...newPresentation.theme,
				audio: files[0].location,
			};
			dispatch({
				type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
				payload: { presentation: newPresentation },
			});
		}
	}, [presentation]);

	return (
		<>
			<SettingsRow
				label={t('bgAudio')}
				isHighlighted={audioLocation !== undefined}
				onClick={async () => {
					if (audioLocation !== undefined) {
					} else {
						if (userLoggedIn) {
							setOpenLocalRemoteSelector(true);
						} else {
							handleSelectLocal();
						}
					}
				}}
				primaryNode={
					audioLocation !== undefined ? (
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<IconButton
								size='small'
								onClick={() => {
									if (isPlaying) {
										audio.pause();
									} else {
										audio.play();
									}
									setIsPlaying((curr) => !curr);
								}}
							>{ !isPlaying ? <PlayCircle/> : <PauseCircle/> }</IconButton>
							<EditableText
								variant='body2'
								style={{
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									display: 'inline-block',
									maxWidth: '200px',
								}}
							>
								{audioLocation === presentation.theme?.audio?.remote
									? t('cloudAudio')
									: audioLocation?.split('/').pop()}
							</EditableText>
						</Box>
					) : undefined
				}
				node={
					presentation.theme?.audio?.local !== undefined ||
					presentation.theme?.audio?.remote !== undefined ? (
						<Box>
							<Button
								variant='contained'
								onClick={() => {
									const newPresentation = JSON.parse(
										JSON.stringify(presentation)
									);
									newPresentation.theme = {
										...newPresentation.theme,
										audio: undefined,
									};
									dispatch({
										type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
										payload: { presentation: newPresentation },
									});
								}}
							>
								{t('remove')}
							</Button>
						</Box>
					) : (
						<Box sx={{ width: '45px', height: '45px' }}>
							<Audiotrack
								sx={{ height: '100%', width: '100%', color: 'text.primary' }}
							/>
						</Box>
					)
				}
			/>
			{openLocalRemoteSelector && (
				<LocalOrRemoteModal
					open={true}
					onClose={() => setOpenLocalRemoteSelector(false)}
					onSelection={(selection) => {
						if (selection === 'local') handleSelectLocal();
						if (selection === 'remote') setOpenRemoteFileExplorer(true);
						setOpenLocalRemoteSelector(false);
					}}
				/>
			)}
			{openRemoteFileExplorer && (
				<RemoteFileExplorer
					open={true}
					onClose={() => setOpenRemoteFileExplorer(false)}
					filterItems='audio'
					onMediaChoosen={(url) => {
						const newPresentation = JSON.parse(JSON.stringify(presentation));
						newPresentation.theme = {
							...newPresentation.theme,
							audio: { remote: url },
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

export default BackgroundAudio;
