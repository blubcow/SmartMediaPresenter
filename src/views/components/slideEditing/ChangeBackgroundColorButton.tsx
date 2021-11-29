import React, { useState } from 'react';
import { Box } from '../../../smpUI/components';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import ColorPicker from '../ColorPicker';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';

interface IChangeBackgroundColorButtonProps {}

const ChangeBackgroundColorButton: React.FC<IChangeBackgroundColorButtonProps> =
	(props) => {
		const { state, dispatch } = usePresentationEditingContext();
		const { presentation, currentSlide } = state;
		const backgroundColor =
			presentation.slides[currentSlide].settings?.color ?? '#000';
		const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
		const { t } = useTranslation([i18nNamespace.Presentation]);
		return (
			<>
				<EditingButton
					selected={colorPickerOpen}
					icon={<BackgroundColorIcon color={backgroundColor} />}
					secondaryNode={
						<EditButtonLabel>{t('changeSlideColor')}</EditButtonLabel>
					}
					onClick={() => {
						setColorPickerOpen(true);
					}}
					{...props}
				/>
				<ColorPicker
					title={t('changeSlideColor')}
					onClose={() => {
						setColorPickerOpen(false);
					}}
					open={colorPickerOpen}
					initialColor={backgroundColor}
					onColorPicked={(color) => {
						let newPresentation = { ...presentation };
						const settings = {
							...newPresentation.slides[currentSlide].settings,
							color: color,
						};
						presentation.slides[currentSlide].settings = settings;
						dispatch({
							type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
							payload: { presentation: newPresentation },
						});
						setColorPickerOpen(false);
					}}
					onCancel={() => {
						setColorPickerOpen(false);
					}}
				/>
			</>
		);
	};

interface IBackgroundColorIconProps {
	color: string;
}

const BackgroundColorIcon: React.FC<IBackgroundColorIconProps> = (props) => {
	const { color } = props;

	return (
		<Box
			sx={{
				height: '100%',
				width: '100%',
				bgcolor: color,
				borderWidth: '2px',
				borderStyle: 'solid',
				borderColor: 'text.primary',
				borderRadius: 1,
			}}
		/>
	);
};

export default ChangeBackgroundColorButton;
