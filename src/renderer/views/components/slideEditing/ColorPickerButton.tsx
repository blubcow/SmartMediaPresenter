import React, { useState } from 'react';
import EditingButton from './EditingButton';
import EditButtonLabel from './EditButtonLabel';
import ColorPicker from '../ColorPicker';
import ColorPickerIcon from './ColorPickerIcon';
import _ from 'lodash';

interface IColorPickerButtonProps {
	label: string;
	color: string;
	onColorPicked: (color: string) => void;
}

const ColorPickerButton: React.FC<IColorPickerButtonProps> = (props) => {
	const { label, color, onColorPicked } = props;
	const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

	const editingButtonProps = _.omit(props, ['label', 'color', 'onColorPicked']);

	return (
		<>
			<EditingButton
				selected={colorPickerOpen}
				icon={<ColorPickerIcon color={color} />}
				secondaryNode={<EditButtonLabel>{label}</EditButtonLabel>}
				onClick={() => {
					setColorPickerOpen(true);
				}}
				{...editingButtonProps}
			/>
			<ColorPicker
				title={label}
				onClose={() => {
					setColorPickerOpen(false);
				}}
				open={colorPickerOpen}
				initialColor={color}
				onColorPicked={(color) => {
					onColorPicked(color);
					setColorPickerOpen(false);
				}}
				onCancel={() => {
					setColorPickerOpen(false);
				}}
			/>
		</>
	);
};

export default ColorPickerButton;
