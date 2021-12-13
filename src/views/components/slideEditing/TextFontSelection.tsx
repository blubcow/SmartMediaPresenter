import React, { useState } from 'react';
import { useSystemFonts } from '../../../hooks/useMainProcessMethods';
import {
	Box,
	AutoCompleteSelection,
	TextField,
} from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import {
	SinglePresentation,
	TextElement,
} from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import TextFontSelectionOption from './TextFontSelectionOption';

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
							renderOption={(props, option) => (
								<TextFontSelectionOption font={option} {...props} />
							)}
							renderInput={(params) => {
								params.inputProps.style = {
									fontFamily: (
										presentation.slides[currentSlide].elements![
											activeComponent
										] as TextElement
									).font,
								};

								return <TextField {...params} label={t('font')} />;
							}}
						/>
					</Box>
				)}
		</>
	);
};

export default TextFontSelection;
