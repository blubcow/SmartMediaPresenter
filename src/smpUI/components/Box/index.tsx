import React, { PropsWithChildren } from 'react';
import { Box as MUIBox } from '@mui/material';

interface IBoxProps {}

const Box: React.FC<PropsWithChildren<IBoxProps>> = (props) => {
	return <MUIBox {...props}></MUIBox>;
};
