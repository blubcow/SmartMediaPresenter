import React, { useState } from 'react';
import { Box } from '../../../smpUI/components';
import EditingButton, { IEditingButtonProps } from './EditingButton';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import EditButtonLabel from './EditButtonLabel';
import ColorPicker from '../ColorPicker';

interface IChangeBackgroundColorButtonProps
	extends Omit<IEditingButtonProps, 'icon' | 'secondaryNode'> {
	backgroundColor: string;
	onSlideColorChanged: (color: string) => void;
}

const ChangeBackgroundColorButton: React.FC<IChangeBackgroundColorButtonProps> =
	(props) => {
		const { backgroundColor, onSlideColorChanged } = props;
		const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
		const { t } = useTranslation([i18nNamespace.Presentation]);
		return (
			<>
				<EditingButton
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
						onSlideColorChanged(color);
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
