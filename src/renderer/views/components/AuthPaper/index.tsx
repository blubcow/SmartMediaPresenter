import React from 'react';
import { Paper } from '../../../smpUI/components';
import AuthViews from '../AuthViews';
import { useNavigate } from 'react-router-dom';
import { SMPRoutes } from '../../../types/routes';

const AuthPaper: React.FC<{}> = () => {
	const navigate = useNavigate();
	return (
		<Paper>
			<AuthViews onLogin={() => navigate(SMPRoutes.Home, {replace: true})} />
		</Paper>
	);
};

export default AuthPaper;
