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
			<Container className={classes.contentContainer} maxWidth='xl'>
				{centeredContent ? (
					<Box className={classes.centeredContentBox}>{children}</Box>
				) : (
					children
				)}
			</Container>
		</Box>
	);
};

export default Page;
