import React from 'react';
import { Box } from '../../../smpUI/components';

interface IColorPickerIconProps {
	color: string;
}

const ColorPickerIcon: React.FC<IColorPickerIconProps> = (props) => {
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

export default ColorPickerIcon;
