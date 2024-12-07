import React from 'react';
import { EditableText, ITextProps } from '../../smpUI';

export const EditableCaptionText: React.FC<ITextProps> = (props) => {
	return <EditableText variant='caption' lineHeight='100%' {...props} />;
};
