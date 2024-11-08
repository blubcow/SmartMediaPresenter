import React from 'react';
import { Card as MUICard, CardProps } from '@mui/material';

export interface ICardProps extends CardProps {}

// TODO: Empty components like these can be easily removed
// Check why these even exist in the first place! This seems like an empty wrapper.
const Card: React.FC<ICardProps> = React.forwardRef((props, ref) => {
	return <MUICard {...props} ref={ref} />;
});

export default Card;
