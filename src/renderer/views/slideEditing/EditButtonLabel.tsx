import React from 'react';
import Text from '../../smpUI/Text';
import { ITextProps } from '../../smpUI/Text';

interface IEditButtonLabelProps extends ITextProps {}

const EditButtonLabel: React.FC<IEditButtonLabelProps> = (props) => {
	return <Text variant='caption' lineHeight='100%' {...props} />;
};

export default EditButtonLabel;
