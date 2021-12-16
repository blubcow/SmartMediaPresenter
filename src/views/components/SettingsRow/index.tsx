import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useRowStyles } from './styles';

interface IRowProps {
	label: string;
	primaryNode?: React.ReactNode;
	node: React.ReactNode;
	onClick?: () => void;
	isHighlighted?: boolean;
}

const Row: React.FC<IRowProps> = (props) => {
	const { label, primaryNode, node, onClick, isHighlighted = false } = props;
	const classes = useRowStyles();
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

export default Row;
