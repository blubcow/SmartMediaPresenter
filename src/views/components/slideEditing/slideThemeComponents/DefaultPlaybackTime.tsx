import React, { useEffect, useState } from 'react';
import Row from '../../SettingsRow';
import { Box, Text } from '../../../../smpUI/components';
import { useDefaultPlaybackTimeStyles } from './styles';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

const DefaultPlaybackTime: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const classes = useDefaultPlaybackTimeStyles();
	const [duration, setDuration] = useState<number | undefined>(
		presentation.theme?.defaultPlaybackDuration
	);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.theme = {
			...newPresentation.theme,
			defaultPlaybackDuration: duration,
		};
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	}, [duration]);

	return (
		<Row
			label={t('defaultAutoPlaybackTime')}
			node={
				<Box className={classes.nodeContainer}>
					<Text
						editable
						placeholder={t('noTimeSet')}
						color={duration !== undefined ? 'text.primary' : 'GrayText'}
						parseInput={(val) =>
							`${val === '' ? '' : isNaN(parseInt(val)) ? 0 : parseInt(val)}`
						}
						editableTextDidChange={(_, curr) => {
							const newDuration = parseInt(curr);
							if (curr === '' || isNaN(newDuration)) {
								setDuration(undefined);
								return;
							}

							setDuration(newDuration);
						}}
					>
						{duration}
					</Text>
					{duration !== undefined && (
						<Box sx={{ pl: 1 }}>
							<Text>sec</Text>
						</Box>
					)}
				</Box>
			}
		/>
	);
};

export default DefaultPlaybackTime;
