import React, { useState } from 'react';
import Login from './Login';

interface IAuthViewsProps {
	onLogin: () => void;
}

const AuthViews: React.FC<IAuthViewsProps> = (props) => {
	const { onLogin } = props;
	const [openForgotPwd, setOpenForgotPwd] = useState<boolean>(false);
	const [openCreateAccount, setOpenCreateAccount] = useState<boolean>(false);

	return (
		<>
			<Login onLogin={onLogin} />
		</>
	);
};

export default AuthViews;
