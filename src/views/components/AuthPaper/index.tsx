import React from 'react';
import { Paper } from '../../../smpUI/components';
import AuthViews from '../AuthViews';

const AuthPaper: React.FC<{}> = () => {
	return (
		<Paper>
			<AuthViews />
		</Paper>
	);
};

export default AuthPaper;
