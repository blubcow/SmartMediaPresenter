import React, { useState, useEffect, useCallback } from 'react';
import Row from '../../SettingsRow';
import { Box, Text, Button, IconButton } from '../../../../smpUI/components';
import { Audiotrack } from '@mui/icons-material';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { useLocalFileSystem } from '../../../../hooks/useMainProcessMethods';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import useRemoteUserContext from '../../../../hooks/useRemoteUserContext';
import LocalOrRemoteModal from '../../modals/LocalOrRemoteModal';
import RemoteFileExplorer from '../../RemoteFileExplorer';

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
			<Row
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
								icon={!isPlaying ? PlayCircle : PauseCircle}
								onClick={() => {
									if (isPlaying) {
										audio.pause();
									} else {
										audio.play();
									}
									setIsPlaying((curr) => !curr);
								}}
							/>
							<Text
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
							</Text>
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
					}}
				/>
			)}
		</>
	);
};

export default BackgroundAudio;
