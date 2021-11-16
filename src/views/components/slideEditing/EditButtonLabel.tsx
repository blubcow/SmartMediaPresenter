import React from 'react';
import { Text } from '../../../smpUI/components';
import { ITextProps } from '../../../smpUI/components/Text';

interface IEditButtonLabelProps extends ITextProps {}

const EditButtonLabel: React.FC<IEditButtonLabelProps> = (props) => {
	return <Text variant='caption' lineHeight='100%' {...props} />;
};

export default EditButtonLabel;
