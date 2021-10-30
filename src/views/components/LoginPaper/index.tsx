import React from 'react';
import { Box, Paper, Text } from '../../../smpUI/components';
import useThemedLogo from '../../../hooks/useThemedLogo';
import useStyles from './styles';

const LoginPaper: React.FC<{}> = () => {
	const logo = useThemedLogo();
	const classes = useStyles();

	return (
		<Paper>
			<Box className={classes.container}>
				<img src={logo.logo} className={classes.img} />
				<Text>Login</Text>
			</Box>
		</Paper>
	);
};

export default LoginPaper;
