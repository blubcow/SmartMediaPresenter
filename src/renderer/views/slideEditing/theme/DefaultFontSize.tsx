import { Box, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePresentationEditingContext } from '../../../hooks';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { EditableText } from '../../../smpUI';
import SettingsRow from '../../settings/SettingsRow';

export const useDefaultFontSizeStyles = makeStyles((theme: Theme) =>
	createStyles({
		nodeContainer: {
			width: '120px',
			display: 'flex',
			justifyContent: 'flex-end',
		},
	})
);


const DefaultFontSize: React.FC<{}> = () => {
	const classes = useDefaultFontSizeStyles();
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [size, setSize] = useState<number | undefined>(
		presentation.theme?.defaultFontSize
	);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	useEffect(() => {
		const newPresentation = JSON.parse(JSON.stringify(presentation));
		newPresentation.theme = { ...newPresentation.theme, defaultFontSize: size };
		dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	}, [size]);

	return (
		<SettingsRow
			label={t('defaultFontSize')}
			node={
				<Box className={classes.nodeContainer}>
					<EditableText
						align='center'
						editable
						placeholder={t('noDefaultSize')}
						color={size !== undefined ? 'text.primary' : 'GrayText'}
						parseInput={(val) =>
							`${
								val === ''
									? ''
									: isNaN(parseFloat(val))
									? 0
									: Math.max(parseFloat(val), 0)
							}`
						}
						editableTextDidChange={(_, curr) => {
							setSize(curr === '' ? undefined : parseFloat(curr));
						}}
					>
						{size}
					</EditableText>
					<Box sx={{ display: size !== undefined ? 'initial' : 'none', pl: 1 }}>
						<EditableText>px</EditableText>
					</Box>
				</Box>
			}
		/>
	);
};

export default DefaultFontSize;
