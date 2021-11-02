import React from 'react';
import { AppBar, AppBarProps, Toolbar } from '@mui/material';

interface ITopBarProps extends AppBarProps {
	withFixedHeight?: string;
}

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { withFixedHeight = '75px' } = props;

	return (
		<AppBar
			variant='elevation'
			position='static'
			sx={{
				backgroundColor: 'background.paper',
				maxHeight: withFixedHeight,
				height: withFixedHeight,
			}}
			{...props}
		>
			<Toolbar sx={{ height: '100%' }}>{props.children}</Toolbar>
		</AppBar>
	);
};

export default TopBar;
