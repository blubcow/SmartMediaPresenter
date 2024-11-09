import React, { useState, useEffect } from 'react';
import SettingsRow from '../../settings/SettingsRow';
import Text from '../../../smpUI/Text';
import { Box} from '@mui/material';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useDefaultFormatStyles = makeStyles((theme: Theme) =>
	createStyles({
		nodeContainer: {
			display: 'flex',
			width: '250px',
			justifyContent: 'space-around',
		},
		inputContainer: {
			width: '100px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

const DefaultFormat: React.FC<{}> = () => {
	const classes = useDefaultFormatStyles();
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [rows, setRows] = useState<number>(
		presentation.theme?.defaultFormat?.rows ?? 1
	);
	const [columns, setColumns] = useState<number>(
		presentation.theme?.defaultFormat?.columns ?? 2
	);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.theme = {
			...newPresentation.theme,
			defaultFormat: { rows: rows, columns: columns },
		};
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	}, [rows, columns]);

	return (
		<SettingsRow
			label={t('defaultFormat')}
			node={
				<Box className={classes.nodeContainer}>
					<Box className={classes.inputContainer}>
						<Text>{t('rows')}</Text>
						<Text
							editable
							minLength={1}
							editableTextDidChange={(_, curr) => {
								setRows(parseInt(curr));
							}}
							parseInput={(val) =>
								`${
									val === ''
										? ''
										: Math.min(
												isNaN(parseInt(val)) ? 1 : Math.max(parseInt(val), 1),
												5
										  )
								}`
							}
						>
							{rows}
						</Text>
					</Box>
					<Box className={classes.inputContainer}>
						<Text>{t('columns')}</Text>
						<Text
							editable
							minLength={1}
							editableTextDidChange={(_, curr) => {
								setColumns(parseInt(curr));
							}}
							parseInput={(val) =>
								`${
									val === ''
										? ''
										: Math.min(
												isNaN(parseInt(val)) ? 1 : Math.max(parseInt(val), 1),
												5
										  )
								}`
							}
						>
							{columns}
						</Text>
					</Box>
				</Box>
			}
		/>
	);
};

export default DefaultFormat;
