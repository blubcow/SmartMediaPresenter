import React from 'react';
import { Box, Text } from '../../../../smpUI/components';
import { BoxProps } from '@mui/material';
import useStyles from './styles';

interface IBaseRowProps extends BoxProps {
	title: string;
	info?: string;
	// TODO: create type for IconBadge: "type IconBadgeType = IconBadge" and use this type here rather than the Element type
	iconBadge: React.ReactNode;
}

const BaseRow: React.FC<IBaseRowProps> = (props) => {
	const { title, info, iconBadge: IconBadge } = props;
	const classes = useStyles();

	return (
		<Box className={classes.container} clickable {...props}>
			<Box className={classes.textContainer}>
				<Text fontWeight='bold'>{title}</Text>
				{info && (
					<Text className={classes.infoLabel} variant='body2'>
						{info}
					</Text>
				)}
			</Box>
			{IconBadge}
		</Box>
	);
};

export default BaseRow;
