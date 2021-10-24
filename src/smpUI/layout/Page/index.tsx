import React, { PropsWithChildren } from 'react';
import { Container } from '@mui/material';
import useStyles from './styles';

interface IPageProps {}

const Page: React.FC<PropsWithChildren<IPageProps>> = ({ children }) => {
	const classes = useStyles();

	return (
		<Container className={classes.root} maxWidth='lg'>
			{children}
		</Container>
	);
};

export default Page;
