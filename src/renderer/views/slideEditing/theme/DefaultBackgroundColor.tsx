import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import ColorPicker from '../../components/ColorPicker';
import SettingsRow from '../../settings/SettingsRow';
import ColorPickerIcon from '../ColorPickerIcon';
import { usePresentationEditingContext } from '../../../hooks';

const DefaultBackgroundColor: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [open, setOpen] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<SettingsRow
				label={t('defaultBgColor')}
				node={
					<Box sx={{ width: '45px', height: '45px' }}>
						<ColorPickerIcon
							color={presentation.theme?.defaultBackgroundColor ?? '#000'}
						/>
					</Box>
				}
				onClick={() => setOpen(true)}
			/>
			<ColorPicker
				title={t('defaultBgColor')}
				initialColor={presentation.theme?.defaultBackgroundColor ?? '#000000'}
				open={open}
				onCancel={() => setOpen(false)}
				onClose={() => setOpen(false)}
				onColorPicked={(color) => {
					const newPresentation = JSON.parse(JSON.stringify(presentation));
					newPresentation.theme = {
						...newPresentation.theme,
						defaultBackgroundColor: color,
					};
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
					setOpen(false);
				}}
			/>
		</>
	);
};

export default DefaultBackgroundColor;
