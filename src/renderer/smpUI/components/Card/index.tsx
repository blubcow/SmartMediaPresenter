import React from 'react';
import { Card as MUICard, CardProps } from '@mui/material';

export interface ICardProps extends CardProps {}

// TODO: Remove this whole component???
const Card: React.FC<ICardProps> = React.forwardRef((props, ref) => {
	return <MUICard {...props} ref={ref} />;
});

export default Card;
