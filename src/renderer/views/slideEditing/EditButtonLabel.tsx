import React from 'react';
import { EditableText, ITextProps } from '../../smpUI';

// TODO: Empty component?

interface IEditButtonLabelProps extends ITextProps {}

const EditButtonLabel: React.FC<IEditButtonLabelProps> = (props) => {
	return <EditableText variant='caption' lineHeight='100%' {...props} />;
};

export default EditButtonLabel;
