import React, { ReactNode } from 'react';
import { Box, Card } from '../../../smpUI/components';
import { ButtonBase } from '@mui/material';
import { ICardProps } from '../../../smpUI/components/Card';
import useStyles from './styles';

export interface IEditingButtonProps extends ICardProps {
	icon: ReactNode;
	secondaryNode: ReactNode;
	selected: boolean;
}

const EditingButton: React.FC<IEditingButtonProps> = (props) => {
	const { icon, secondaryNode, selected } = props;
	const classes = useStyles();

	return (
		<Card
			className={classes.editingCard}
			variant='elevation'
			elevation={10}
			sx={{ outlineWidth: selected ? '2px' : 0 }}
			{...props}
		>
			<ButtonBase className={classes.container} id='mediaOrSlideEditing'>
				<Box className={classes.iconContainer}>{icon}</Box>
				<Box className={classes.secondaryContainer}>{secondaryNode}</Box>
			</ButtonBase>
		</Card>
	);
};

export default EditingButton;
