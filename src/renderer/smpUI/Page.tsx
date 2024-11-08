import React, { PropsWithChildren } from 'react';
import { Container } from '@mui/material';
import { Box } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => {
	return createStyles({
		root: {
			minHeight: '100vh',
			width: '100vw',
			height: '1px',
			backgroundColor: theme.palette.background.default,
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
		},
		contentContainer: {
			height: '0px',
			flex: 1,
			width: '100%',
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
		centeredContentBox: {
			height: '100%',
			maxHeight: '100%',
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	});
});

interface IPageProps {
	centeredContent?: boolean;
	TopBar?: React.ReactNode;
}

const Page: React.FC<PropsWithChildren<IPageProps>> = ({
	centeredContent = false,
	TopBar,
	children,
}) => {
	const classes = useStyles();

	return (
		<Box className={classes.root}>
			{TopBar}
			<Box className={classes.contentContainer}>
				{centeredContent ? (
					<Box className={classes.centeredContentBox}>{children}</Box>
				) : (
					children
				)}
			</Box>
		</Box>
	);
};

export default Page;
