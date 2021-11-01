import React from 'react';
import { TextField as MUITextField, FilledTextFieldProps } from '@mui/material';

interface ITextFieldProps extends Omit<FilledTextFieldProps, 'variant'> {}

const TextField: React.FC<ITextFieldProps> = (props) => {
	return <MUITextField variant='filled' size='small' fullWidth {...props} />;
};

export default TextField;
