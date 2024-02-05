import React, { useState, useEffect } from 'react';
import Row from '../../SettingsRow';
import { Box, Text } from '../../../../smpUI/components';
import { useDefaultFormatStyles } from './styles';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

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
		<Row
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
