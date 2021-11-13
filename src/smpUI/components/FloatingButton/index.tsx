import React, { PropsWithChildren } from 'react';
import { Fab, FabProps } from '@mui/material';
import { Box } from '..';
import useStyles from './styles';

interface IFloatingButtonProps extends FabProps {}

const FloatingButton: React.FC<IFloatingButtonProps> = (props) => {
	return (
		<Fab {...props} sx={{ ml: 3, padding: 2.5, ...props.sx }} size='small' />
	);
};

export const FloatingButtonContainer: React.FC<PropsWithChildren<{}>> = (
	props
) => {
	const { children } = props;
	const classes = useStyles();

	return <Box className={classes.container}>{children}</Box>;
};

export default FloatingButton;
