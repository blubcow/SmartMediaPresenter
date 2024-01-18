import React from 'react';
import { Box, Text } from '..';
import { IBoxProps } from '../Box';
import useStyles from './styles';

export interface IRowProps extends IBoxProps {
	rootContainerStyle?: any;
	title?: string;
	info?: string;
	secondaryInfo?: string;
	iconBadge?: React.ReactNode;
	height?: string;
	selected?: boolean;
}

const Row: React.FC<IRowProps> = (props) => {
	const {
		title,
		info,
		secondaryInfo,
		iconBadge: IconBadge,
		rootContainerStyle,
		height = '135px',
		selected = false,
	} = props;
	const classes = useStyles();

	return (
		<Box className={classes.root} sx={rootContainerStyle}>
			<Box
				className={classes.container}
				{...props}
				sx={{
					height: height,
					outlineStyle: 'solid',
					outlineWidth: selected ? '2px' : '0',
					...props.style,
					...props.sx,
				}}
			>
				{title || info || IconBadge ? (
					<Box className={classes.baseContainer}>
						<Box className={classes.textContainer}>
							{title !== undefined && <Text fontWeight='bold'>{title}</Text>}
							{info !== undefined && (
								<Text className={classes.infoLabel} variant='body2'>
									{info}
								</Text>
							)}
							{secondaryInfo !== undefined && (
								<Text className={classes.secondaryInfoLabel} variant='caption'>
									{secondaryInfo}
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
