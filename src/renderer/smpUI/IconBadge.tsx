import React from 'react';
import { Box } from '.';
import { IBoxProps } from './Box';
import { SvgIconComponent } from '@mui/icons-material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(2),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: '50%',
			// this pseudo selection makes sure, that the container will alwais remain a square
			':after': {
				content: '""',
				display: 'block',
				paddingBottom: '100%',
			},
		},
	})
);

interface IIconBadgeProps extends IBoxProps {
	icon: SvgIconComponent;
	iconSize?: string;
}

const IconBadge: React.FC<IIconBadgeProps> = (props) => {
	const { icon: Icon, iconSize = '55px', ...boxProps } = props;
	const classes = useStyles();

	return (
		<Box className={classes.container} {...boxProps}>
			<Icon style={{ fontSize: iconSize }} />
		</Box>
	);
};

export default IconBadge;
