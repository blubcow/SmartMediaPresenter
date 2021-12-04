import React from 'react';
import { Box, Button, Text } from '../../../../smpUI/components';
import { useMatchAudioTimeContentStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

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
				<Text variant='body2' color='primary.contrastText'>
					{t('slideDurationMatchesAudio')}
				</Text>
			</Box>
			<Button variant='contained' color='primary' onClick={onEnableOverriding}>
				{t('override')}
			</Button>
		</Box>
	);
};

export default MatchAudioTimeContent;
