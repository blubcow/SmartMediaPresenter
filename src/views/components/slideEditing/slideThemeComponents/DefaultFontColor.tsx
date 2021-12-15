import React, { useState } from 'react';
import Row from './Row';
import { Box } from '../../../../smpUI/components';
import ColorPickerIcon from '../ColorPickerIcon';
import usePresentationEditingContext from '../../../../hooks/usePresentationEditingContext';
import ColorPicker from '../../ColorPicker';
import { PresentationEditingActionIdentifiers } from '../../../../types/identifiers';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../../i18n/i18n';

const DefaultFontColor: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation } = state;
	const [open, setOpen] = useState<boolean>(false);
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			<Row
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
