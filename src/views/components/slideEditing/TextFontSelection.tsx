import React, { useState } from 'react';
import { useSystemFonts } from '../../../hooks/useMainProcessMethods';
import { Box, AutoCompleteSelection } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import {
	SinglePresentation,
	TextElement,
} from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

const TextFontSelection: React.FC<{}> = () => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent, lastFont } = state;
	const { fonts } = useSystemFonts();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			{activeComponent !== undefined &&
				presentation.slides[currentSlide].elements && (
					<Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
						<AutoCompleteSelection
							label={t('font')}
							value={
								(
									presentation.slides[currentSlide].elements![
										activeComponent
									] as TextElement
								).font
							}
							onValueChanged={(val) => {
								const newPresentation: SinglePresentation = JSON.parse(
									JSON.stringify(presentation)
								);
								(
									newPresentation.slides[currentSlide].elements![
										activeComponent
									] as TextElement
								).font = val;
								dispatch({
									type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
									payload: {
										presentation: newPresentation,
									},
								});
							}}
							options={fonts}
							style={{ width: '250px' }}
						/>
					</Box>
				)}
		</>
	);
};

export default TextFontSelection;
