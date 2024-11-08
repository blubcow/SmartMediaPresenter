import React, { useState } from 'react';
import SettingsRow from '../../settings/SettingsRow';
import { Box } from '../../../smpUI';
import ColorPickerIcon from '../ColorPickerIcon';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import ColorPicker from '../../components/ColorPicker';
import { PresentationEditingActionIdentifiers } from '../../../shared/identifiers.enum';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

const DefaultFontColor: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [open, setOpen] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<SettingsRow
				label={t('defaultFontColor')}
				node={
					<Box sx={{ width: '45px', height: '45px' }}>
						<ColorPickerIcon
							color={presentation.theme?.defaultFontColor ?? '#fff'}
						/>
					</Box>
				}
				onClick={() => setOpen(true)}
			/>
			<ColorPicker
				title={t('defaultFontColor')}
				initialColor={presentation.theme?.defaultFontColor ?? '#fff'}
				open={open}
				onColorPicked={(color) => {
					const newPresentation = JSON.parse(JSON.stringify(presentation));
					newPresentation.theme = {
						...newPresentation.theme,
						defaultFontColor: color,
					};
					dispatch({
						type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
						payload: { presentation: newPresentation },
					});
					setOpen(false);
				}}
				onClose={() => setOpen(false)}
				onCancel={() => setOpen(false)}
			/>
		</>
	);
};

export default DefaultFontColor;
