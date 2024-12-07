import React, { useEffect, useState } from 'react';
import SettingsRow from '../../settings/SettingsRow';
import { EditableText } from '../../../smpUI/EditableText';
import { Box} from '@mui/material';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useDefaultPlaybackTimeStyles = makeStyles((theme: Theme) =>
	createStyles({
		nodeContainer: {
			display: 'flex',
			width: '95px',
			justifyContent: 'flex-end',
		},
	})
);

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
		<SettingsRow
			label={t('defaultAutoPlaybackTime')}
			node={
				<Box className={classes.nodeContainer}>
					<EditableText
						align='center'
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
					</EditableText>
					{duration !== undefined && (
						<Box sx={{ pl: 1 }}>
							<EditableText>sec</EditableText>
						</Box>
					)}
				</Box>
			}
		/>
	);
};

export default DefaultPlaybackTime;
