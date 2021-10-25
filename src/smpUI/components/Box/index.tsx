import React, { PropsWithChildren } from 'react';
import { Box as MUIBox, BoxProps } from '@mui/material';

interface IBoxProps extends BoxProps {}

const Box: React.FC<PropsWithChildren<IBoxProps>> = (props) => {
	return <MUIBox {...props}></MUIBox>;
};

export default Box;
