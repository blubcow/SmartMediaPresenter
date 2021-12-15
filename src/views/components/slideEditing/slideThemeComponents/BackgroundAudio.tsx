import React, { useState, useEffect } from 'react';
import Row from './Row';
import { Box, Text, Button, IconButton } from '../../../../smpUI/components';
import { Audiotrack } from '@mui/icons-material';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { useLocalFileSystem } from '../../../../hooks/useMainProcessMethods';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';
import { PauseCircle, PlayCircle } from '@mui/icons-material';

const BackgroundAudio: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [audioLocation, setAudioLocation] = useState<string | undefined>(
		presentation.theme?.audio?.local ?? presentation.theme?.audio?.remote
	);
	const { openFileSelectorDialog } = useLocalFileSystem();
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
		audio.load();
	}, [audioLocation]);

	return (
		<Row
			label={t('bgAudio')}
			isHighlighted={audioLocation !== undefined}
			onClick={async () => {
				if (audioLocation !== undefined) {
				} else {
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
							{audioLocation?.split('/').pop()}
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
	);
};

export default BackgroundAudio;
