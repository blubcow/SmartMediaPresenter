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

interface ITextFontSelectionProps {
	editingTheme?: boolean;
}

const TextFontSelection: React.FC<ITextFontSelectionProps> = (props) => {
	const { editingTheme } = props;
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide, activeComponent, lastFont } = state;
	const { fonts } = useSystemFonts();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<>
			{((activeComponent !== undefined &&
				presentation.slides[currentSlide].elements) ||
				editingTheme) && (
				<Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
					<AutoCompleteSelection
						value={
							editingTheme
								? presentation.theme?.defaultFont
								: (
										presentation.slides[currentSlide].elements![
											activeComponent!
										] as TextElement
								  ).font
						}
						onValueChanged={(val) => {
							const newPresentation: SinglePresentation = JSON.parse(
								JSON.stringify(presentation)
							);
							if (editingTheme) {
								newPresentation.theme = {
									...newPresentation.theme,
									defaultFont: val,
								};
							} else {
								(
									newPresentation.slides[currentSlide].elements![
										activeComponent!
									] as TextElement
								).font = val;
								dispatch({
									type: PresentationEditingActionIdentifiers.lastFontChanged,
									payload: { lastFont: val },
								});
							}

							dispatch({
								type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
								payload: {
									presentation: newPresentation,
								},
							});
						}}
						options={fonts}
						style={{ width: '250px' }}
						renderOption={(htmlAttributes, option) => (
							<TextFontSelectionOption font={option} {...htmlAttributes} />
						)}
						renderInput={(params) => {
							params.inputProps.style = {
								fontFamily: editingTheme
									? presentation.theme?.defaultFont
									: (
											presentation.slides[currentSlide].elements![
												activeComponent!
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
