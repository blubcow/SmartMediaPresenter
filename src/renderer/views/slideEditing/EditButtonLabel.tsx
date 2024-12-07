import React from 'react';
import { EditableText } from '../../smpUI/EditableText';
import { ITextProps } from '../../smpUI/EditableText';

interface IEditButtonLabelProps extends ITextProps {}

const EditButtonLabel: React.FC<IEditButtonLabelProps> = (props) => {
	return <EditableText variant='caption' lineHeight='100%' {...props} />;
};

export default EditButtonLabel;
