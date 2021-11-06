import React from 'react';
import { TopBar } from '../../smpUI/layout';
import { Box, Text } from '../../smpUI/components';

interface IEditTopBarProps {
	fileName?: string;
}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { fileName } = props;

	return (
		<TopBar canGoBack>
			<Box
				sx={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					padding: 2,
				}}
			>
				<Text fontWeight='bold' variant='h5' editable minLength={3}>
					{fileName}
				</Text>
			</Box>
		</TopBar>
	);
};

export default EditTopBar;
