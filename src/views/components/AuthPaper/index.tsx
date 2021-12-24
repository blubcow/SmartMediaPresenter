import React from 'react';
import { Paper } from '../../../smpUI/components';
import AuthViews from '../AuthViews';
import { useHistory } from 'react-router-dom';
import { SMPRoutes } from '../../../types/routes';

const AuthPaper: React.FC<{}> = () => {
	const history = useHistory();
	return (
		<Paper>
			<AuthViews onLogin={() => history.replace(SMPRoutes.Home)} />
		</Paper>
	);
};

export default AuthPaper;
