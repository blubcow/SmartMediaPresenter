import React, { useState } from 'react';
import Login from './Login';

const AuthViews: React.FC<{}> = () => {
	const [openForgotPwd, setOpenForgotPwd] = useState<boolean>(false);
	const [openCreateAccount, setOpenCreateAccount] = useState<boolean>(false);

	return (
		<>
			<Login />
		</>
	);
};

export default AuthViews;
