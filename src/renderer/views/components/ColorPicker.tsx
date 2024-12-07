import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { PhotoshopPicker } from 'react-color';
import { BoxedDialog, IBoxedDialogProps } from '../../smpUI';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		picker: {
			backgroundColor: 'transparent',
			color: theme.palette.text.primary,
		},
	})
);


interface IColorPickerProps extends IBoxedDialogProps {
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
		<BoxedDialog {...modalProps}>
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
				onChange={({ hex }: { hex:string }) => {
					setColor(hex);
				}}
				onAccept={() => {
					onColorPicked(color);
				}}
				onCancel={onCancel}
			/>
		</BoxedDialog>
	);
};

export default ColorPicker;
