import React from 'react';
import { Box } from '..';
import { IBoxProps } from '../Box';
import { SvgIconComponent } from '@mui/icons-material';
import useStyles from './styles';

interface IIconBadgeProps extends IBoxProps {
	icon: SvgIconComponent;
	iconSize?: string;
}

const IconBadge: React.FC<IIconBadgeProps> = (props) => {
	const { icon: Icon, iconSize = '55px' } = props;
	const classes = useStyles();

	return (
		<Box className={classes.container} {...props}>
			<Icon style={{ fontSize: iconSize }} />
		</Box>
	);
};

export default IconBadge;
