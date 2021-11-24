import React from 'react';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/material';

interface ITextAreaProps extends TextareaAutosizeProps {}

const TextArea: React.FC<ITextAreaProps> = (props) => {
	return <TextareaAutosize {...props} />;
};

export default TextArea;
