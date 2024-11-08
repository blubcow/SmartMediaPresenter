import React from 'react';
import { Box, Text } from '../../smpUI';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(1),
			height: '100px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		content: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(2),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderRadius: theme.shape.borderRadius,
			boxShadow: theme.shadows[10],
		},
		txt: {
			pointerEvents: 'none',
		},
	})
);


interface IRowProps {
	label: string;
	primaryNode?: React.ReactNode;
	node: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	isHighlighted?: boolean;
}

const SettingsRow: React.FC<IRowProps> = (props) => {
	const { label, primaryNode, node, onClick, isHighlighted = false } = props;
	const classes = useStyles();
	return (
		<Box className={classes.container}>
			<Box
				className={classes.content}
				sx={{
					cursor: onClick ? 'pointer' : 'initial',
					bgcolor: isHighlighted ? 'secondary.main' : 'background.paper',
				}}
				onClick={onClick}
			>
				<Box>
					<Text
						fontWeight='bold'
						className={classes.txt}
						color={isHighlighted ? 'primary.contrastText' : 'text.primary'}
					>
						{label}
					</Text>
					{primaryNode}
				</Box>
				{node}
			</Box>
		</Box>
	);
};

export default SettingsRow;
