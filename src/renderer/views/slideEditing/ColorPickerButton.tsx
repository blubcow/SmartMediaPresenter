import _ from 'lodash';
import React, { useState } from 'react';
import ColorPicker from '../components/ColorPicker';
import ColorPickerIcon from './ColorPickerIcon';
import { EditableCaptionText } from './EditableCaptionText';
import EditingButton from './EditingButton';

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
				secondaryNode={<EditableCaptionText>{label}</EditableCaptionText>}
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
