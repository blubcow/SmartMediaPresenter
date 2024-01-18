import React, { PropsWithChildren } from 'react';
import { Container } from '@mui/material';
import { Box } from '../../components';
import useStyles from './styles';

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
