import React, { useState } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { Box, Text, Button } from '../../../smpUI';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useChoosePlaybackTimeContentStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(2),
			width: '250px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
		},
		inputContainer: {
			display: 'flex',
			alignItems: 'end',
			paddingTop: theme.spacing(2),
			paddingBottom: theme.spacing(2),
		},
		inputLabelContainer: { minWidth: '80px' },
	})
);

interface IChoosePlaybackTimeContentProps {
	onClose: () => void;
}

const ChoosePlaybackTimeContent: React.FC<IChoosePlaybackTimeContentProps> = (
	props
) => {
	const { onClose } = props;
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;
	const playback = presentation.slides[currentSlide].playback;
	const classes = useChoosePlaybackTimeContentStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	const [duration, setDuration] = useState<number | undefined>(
		playback === undefined || playback === 'audio' ? undefined : playback
	);

	return (
		<Box className={classes.container}>
			<Text>{t('choosePlaybackTime')}</Text>
			<Box className={classes.inputContainer}>
				<Box className={classes.inputLabelContainer}>
					<Text
						placeholder={t('noTimeSet')}
						color={duration !== undefined ? 'text.primary' : 'GrayText'}
						variant={duration !== undefined ? 'h4' : 'body1'}
						editable
						minLength={1}
						parseInput={(val) =>
							`${val === '' ? '' : isNaN(parseInt(val)) ? 0 : parseInt(val)}`
						}
						editableTextDidChange={(_, curr) => {
							if (curr === '') setDuration(undefined);
							const duration = parseInt(curr);
							if (isNaN(duration)) return;

							setDuration(duration);
						}}
					>
						{playback === undefined || playback === 'audio'
							? undefined
							: playback}
					</Text>
				</Box>
				<Text display={duration !== undefined ? 'initial' : 'none'}>sec</Text>
			</Box>
			<Button
				variant='contained'
				onClick={() => {
					const newPresentation = { ...presentation };
					newPresentation.slides = [...presentation.slides];

					newPresentation.slides[currentSlide] = {
						...presentation.slides[currentSlide],
						playback: duration,
					};

					if (duration === undefined && presentation.slides[currentSlide].audio)
						newPresentation.slides[currentSlide].playback = 'audio';

					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
					onClose();
				}}
			>
				{t('confirm')}
			</Button>
		</Box>
	);
};

export default ChoosePlaybackTimeContent;
