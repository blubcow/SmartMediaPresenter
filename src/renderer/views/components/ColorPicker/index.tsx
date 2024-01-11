import React, { useState } from 'react';
import { PhotoshopPicker } from 'react-color';
import { Modal } from '../../../smpUI/components';
import { IModalProps } from '../../../smpUI/components/Modal';
import useStyles from './styles';

interface IColorPickerProps extends IModalProps {
	initialColor: string;
	onColorPicked: (color: string) => void;
	onCancel: () => void;
	title: string;
}

const ColorPicker: React.FC<IColorPickerProps> = (props) => {
	const { initialColor, onColorPicked, onCancel, title, ...modalProps } = props;
	const [color, setColor] = useState<string>(initialColor);
	const classes = useStyles();

	/**
   * 
export interface PhotoshopPickerStylesProps {
    picker: CSSProperties;
    head: CSSProperties;
    body: CSSProperties;
    saturation: CSSProperties;
    hue: CSSProperties;
    controls: CSSProperties;
    top: CSSProperties;
    previews: CSSProperties;
    actions: CSSProperties;
}
   */

	return (
		<Modal {...modalProps}>
			<PhotoshopPicker
				styles={{
					default: {
						previews: {
							display: 'none',
						},
						picker: {
							backgroundColor: 'transparent',
							color: 'inherit',
							boxShadow: 'none',
						},
						head: {
							background: 'transparent',
							outline: 'none',
							border: 'none',
							boxShadow: 'none',
							color: 'inherit',
							fontSize: '21px',
							fontWeight: 700,
						},
						body: {
							background: 'none',
							outline: 'none',
						},
					},
				}}
				header={title}
				className={classes.picker}
				color={color}
				onChange={({ hex }) => {
					setColor(hex);
				}}
				onAccept={() => {
					onColorPicked(color);
				}}
				onCancel={onCancel}
			/>
		</Modal>
	);
};

export default ColorPicker;
