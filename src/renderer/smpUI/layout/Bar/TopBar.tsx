import React from 'react';
import { AppBar, AppBarProps, Toolbar } from '@mui/material';
import { IconButton } from '../../components';
import { ArrowBackIosNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

export interface ITopBarProps extends AppBarProps {
	withFixedHeight?: string;
	canGoBack?: boolean;
	onGoBack?: () => void;
}

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { withFixedHeight = '75px', canGoBack = false, onGoBack } = props;
	const navigate = useNavigate();

	const appBarProps = _.omit(props, ['withFixedHeight', 'canGoBack', 'onGoBack']);

	return (
		<AppBar
			variant='elevation'
			position='sticky'
			sx={{
				backgroundColor: 'background.paper',
				maxHeight: withFixedHeight,
				height: withFixedHeight,
			}}
			{...appBarProps}
		>
			<Toolbar sx={{ height: '100%' }}>
				{canGoBack && (
					<IconButton
						icon={ArrowBackIosNew}
						onClick={() => {
							if (onGoBack) onGoBack();
							else navigate(-1);
						}}
					/>
				)}
				{props.children}
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
