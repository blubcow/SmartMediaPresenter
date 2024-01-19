import React, { useState } from 'react';
import Row from '../../SettingsRow';
import { Box } from '../../../../smpUI/components';
import ColorPickerIcon from '../ColorPickerIcon';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import ColorPicker from '../../ColorPicker';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

const DefaultBackgroundColor: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [open, setOpen] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<Row
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
