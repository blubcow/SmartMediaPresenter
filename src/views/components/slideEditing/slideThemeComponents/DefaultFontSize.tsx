import React, { useState, useEffect } from 'react';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import { Box, Text } from '../../../../smpUI/components';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import Row from './Row';
import { useDefaultFontSizeStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

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
		<Row
			label={t('defaultFontSize')}
			node={
				<Box className={classes.nodeContainer}>
					<Text
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
