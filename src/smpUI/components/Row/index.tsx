import React from 'react';
import { Box, Text } from '..';
import { IBoxProps } from '../Box';
import useStyles from './styles';

export interface IRowProps extends IBoxProps {
	rootContainerStyle?: any;
	title?: string;
	info?: string;
	// TODO: create type for IconBadge: "type IconBadgeType = IconBadge" and use this type here rather than the Element type
	iconBadge?: React.ReactNode;
	height?: string;
}

const Row: React.FC<IRowProps> = (props) => {
	const {
		title,
		info,
		iconBadge: IconBadge,
		rootContainerStyle,
		height = '135px',
	} = props;
	const classes = useStyles();

	return (
		<Box className={classes.root} sx={rootContainerStyle}>
			<Box
				className={classes.container}
				{...props}
				sx={{ height: height, ...props.style, ...props.sx }}
			>
				{title || info || IconBadge ? (
					<Box className={classes.baseContainer}>
						<Box className={classes.textContainer}>
							{title && <Text fontWeight='bold'>{title}</Text>}
							{info && (
								<Text className={classes.infoLabel} variant='body2'>
									{info}
								</Text>
							)}
						</Box>
						{IconBadge}
					</Box>
				) : (
					props.children
				)}
			</Box>
		</Box>
	);
};

export default Row;
