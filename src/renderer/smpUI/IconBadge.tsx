import React from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import { createStyles, makeStyles } from '@mui/styles';
import { Box, BoxProps, ButtonBase, Theme } from '@mui/material';

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

interface IIconBadgeProps extends BoxProps {
	icon: SvgIconComponent;
	iconSize?: string;
	clickable?: boolean;
}

const IconBadge: React.FC<IIconBadgeProps> = (props) => {
	const { icon: Icon, iconSize = '55px', clickable = false, ...boxProps } = props;
	const classes = useStyles();

	return (
		<Box className={classes.container} {...boxProps}>
			{clickable && (
				<ButtonBase
					style={{
						height: '100%',
						width: '100%',
						position: 'absolute',
						top: 0,
						left: 0,
					}}
				/>
			)}
			<Icon style={{ fontSize: iconSize }} />
		</Box>
	);
};

export default IconBadge;
