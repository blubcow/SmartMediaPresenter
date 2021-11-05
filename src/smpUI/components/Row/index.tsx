import React from 'react';
import { Box } from '..';
import { IBoxProps } from '../Box';
import useStyles from './styles';

export interface IRowProps extends IBoxProps {
	rootContainerStyle?: any;
}

const Row: React.FC<IRowProps> = (props) => {
	const { rootContainerStyle } = props;
	const classes = useStyles();

	return (
		<Box className={classes.root} sx={rootContainerStyle}>
			<Box className={classes.container} {...props}>
				{props.children}
			</Box>
		</Box>
	);
};

export default Row;