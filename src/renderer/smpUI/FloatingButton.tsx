import React, { PropsWithChildren } from 'react';
import { Fab, FabProps } from '@mui/material';
import { Box } from './components';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			position: 'absolute',
			bottom: theme.spacing(3),
			right: theme.spacing(5),
			display: 'flex',
			flexDirection: 'row-reverse',
		},
	})
);

interface IFloatingButtonProps extends FabProps {}

const FloatingButton: React.FC<IFloatingButtonProps> = (props) => {
	return (
		<Fab
			{...props}
			sx={{ ml: 3, padding: 2.5, zIndex: 100, ...props.sx }}
			size='small'
		/>
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
