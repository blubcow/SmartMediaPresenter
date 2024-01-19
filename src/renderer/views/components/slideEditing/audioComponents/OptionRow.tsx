import React from 'react';
import { Box, Text } from '../../../../smpUI/components';
import { ButtonBase } from '@mui/material';
import { useOptionRowStyles } from './styles';

interface IOptionRowProps {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
}

const OptionRow: React.FC<IOptionRowProps> = (props) => {
	const { icon, label, onClick } = props;
	const classes = useOptionRowStyles();

	return (
		<Box className={classes.rowContainer} onClick={onClick}>
			<ButtonBase className={classes.btnBase}>
				<Box className={classes.optionRow}>
					<Box className={classes.optionRowIcon}>{icon}</Box>
					<Text>{label}</Text>
				</Box>
			</ButtonBase>
		</Box>
	);
};

export default OptionRow;
