import React, { PropsWithChildren } from 'react';
import { Container } from '@mui/material';
import { Box } from '../../components';
import useStyles from './styles';

interface IPageProps {
	centeredContent?: boolean;
}

const Page: React.FC<PropsWithChildren<IPageProps>> = ({
	centeredContent = false,
	children,
}) => {
	const classes = useStyles();

	return (
		<Container className={classes.root} maxWidth='xl'>
			{centeredContent ? (
				<Box className={classes.centeredContentBox}>{children}</Box>
			) : (
				children
			)}
		</Container>
	);
};

export default Page;
