import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useIconFrameStyles = makeStyles((theme: Theme) =>
	createStyles({
		iconFrame: {
			width: '60px',
			height: '60px',
			borderRadius: '50%',
			backgroundColor: 'transparent',
			outlineColor: theme.palette.text.secondary,
			outlineStyle: 'solid',
			outlineWidth: '1px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

interface IIconFrameProps {
	icon: ReactNode;
}

const IconFrame: React.FC<IIconFrameProps> = (props) => {
	const { icon } = props;
	const classes = useIconFrameStyles();

	return <Box className={classes.iconFrame}>{icon}</Box>;
};

export default IconFrame;
