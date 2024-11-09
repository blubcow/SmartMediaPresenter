import React, { useState, useEffect } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import Text from '../../../smpUI/Text';
import { Box} from '@mui/material';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import SettingsRow from '../../settings/SettingsRow';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

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
					<Text
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
					</Text>
					<Box sx={{ display: size !== undefined ? 'initial' : 'none', pl: 1 }}>
						<Text>px</Text>
					</Box>
				</Box>
			}
		/>
	);
};

export default DefaultFontSize;
