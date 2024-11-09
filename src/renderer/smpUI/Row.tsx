import React from 'react';
import Text from './Text';
import { createStyles, makeStyles } from '@mui/styles';
import { BoxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: theme.spacing(1),
		},
		container: {
			borderRadius: theme.shape.borderRadius,
			overflow: 'hidden',
			border: '1px solid ' + theme.palette.background.paper,
			filter: `drop-shadow(0 0 0.5rem ${theme.palette.divider})`,
			outlineColor: theme.palette.primary.main,
		},
		baseContainer: {
			height: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingLeft: theme.spacing(5),
			paddingRight: theme.spacing(5),
			alignItems: 'center',
		},
		textContainer: {
			height: '100%',
			width: 'auto',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		infoLabel: {
			marginTop: theme.spacing(1),
			color: theme.palette.text.secondary,
		},
		secondaryInfoLabel: {
			marginTop: theme.spacing(0.5),
			color: theme.palette.secondary.main,
		},
	})
);

export interface IRowProps extends BoxProps {
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
		rootContainerStyle,
		secondaryInfo,
		iconBadge: IconBadge,
		height = '135px',
		selected = false,
		...boxProps // Append other props to box | TODO: this is only needed because the click functionality is added with props
	} = props;
	const classes = useStyles();

	return (
		<Box className={classes.root} sx={rootContainerStyle}>
			<Box
				className={classes.container}
				height={height}  // TODO: Height is set two times. Does Box even has a height param?
				{...boxProps}
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
