import React, { ReactNode } from 'react';
import { Box } from '../../../smpUI/components';
import { useIconFrameStyles } from './styles';

interface IIconFrameProps {
	icon: ReactNode;
}

const IconFrame: React.FC<IIconFrameProps> = (props) => {
	const { icon } = props;
	const classes = useIconFrameStyles();

	return <Box className={classes.iconFrame}>{icon}</Box>;
};

export default IconFrame;
