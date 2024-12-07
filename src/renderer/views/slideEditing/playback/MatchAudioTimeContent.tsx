import React from 'react';
import { EditableText } from '../../../smpUI/EditableText';
import { Box, Button} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useMatchAudioTimeContentStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			backgroundColor: theme.palette.secondary.main,
			padding: theme.spacing(2),
			width: '450px',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		textContainer: {
			paddingRight: theme.spacing(2),
		},
	})
);


interface IMatchAudioTimeContentProps {
	onEnableOverriding: () => void;
}

const MatchAudioTimeContent: React.FC<IMatchAudioTimeContentProps> = (
	props
) => {
	const { onEnableOverriding } = props;
	const classes = useMatchAudioTimeContentStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box className={classes.container}>
			<Box className={classes.textContainer}>
				<EditableText variant='body2' color='primary.contrastText'>
					{t('slideDurationMatchesAudio')}
				</EditableText>
			</Box>
			<Button variant='contained' color='primary' onClick={onEnableOverriding}>
				{t('override')}
			</Button>
		</Box>
	);
};

export default MatchAudioTimeContent;
