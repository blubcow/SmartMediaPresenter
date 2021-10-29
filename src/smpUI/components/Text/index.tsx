import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface ITextProps extends TypographyProps {}

const Text: React.FC<ITextProps> = (props) => {
	return <Typography {...props} />;
};

export default Text;
