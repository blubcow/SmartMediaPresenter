import React from 'react';
import Page from '../../smpUI/layout/Page';
import LoginPaper from '../components/LoginPaper';
import { Box, Button } from '../../smpUI/components';
import useStyles from './styles';
import { Link } from 'react-router-dom';

const Login: React.FC<{}> = () => {
	const classes = useStyles();

	return (
		<Page centeredContent>
			<Box className={classes.container}>
				<LoginPaper />
				<Box className={classes.skipLoginButtonContainer}>
					<Link to='/home' style={{ textDecoration: 'none' }}>
						<Button color='warning'>skip login</Button>
					</Link>
				</Box>
			</Box>
		</Page>
	);
};

export default Login;
