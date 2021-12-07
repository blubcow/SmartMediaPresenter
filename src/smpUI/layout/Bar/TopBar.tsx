import React from 'react';
import { AppBar, AppBarProps, Toolbar } from '@mui/material';
import { IconButton } from '../../components';
import { ArrowBackIosNew } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

export interface ITopBarProps extends AppBarProps {
	withFixedHeight?: string;
	canGoBack?: boolean;
	onGoBack?: () => void;
}

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { withFixedHeight = '75px', canGoBack = false, onGoBack } = props;
	const history = useHistory();

	return (
		<AppBar
			variant='elevation'
			position='sticky'
			sx={{
				backgroundColor: 'background.paper',
				maxHeight: withFixedHeight,
				height: withFixedHeight,
			}}
			{...props}
		>
			<Toolbar sx={{ height: '100%' }}>
				{canGoBack && (
					<IconButton
						icon={ArrowBackIosNew}
						onClick={() => {
							if (onGoBack) onGoBack();
							else history.goBack();
						}}
					/>
				)}
				{props.children}
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
