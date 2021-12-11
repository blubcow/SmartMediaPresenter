import React from 'react';
import { Box } from '../../../smpUI/components';
import TextStyleButton from './TextStyleButton';
import TextAliginmentButton from './TextAlignmentButton';

const TextOptionsContainer: React.FC<{}> = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'space-around',
				alignItems: 'center',
			}}
		>
			<TextStyleButton />
			<TextAliginmentButton />
		</Box>
	);
};

export default TextOptionsContainer;
