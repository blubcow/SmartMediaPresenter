import React from 'react';
import { Card as MUICard, CardProps } from '@mui/material';

export interface ICardProps extends CardProps {}

const Card: React.FC<ICardProps> = (props) => {
	return <MUICard {...props} />;
};

export default Card;
