import React from 'react';
import { TopBar } from '../../../smpUI/layout';
import { Box, Text } from '../../../smpUI/components';

export interface ITopBarDisplayingFilenameProps {
	fileName?: string;
	onFilenameChanged?: (filename: string) => void;
}

const TopBarDisplayingFilename: React.FC<ITopBarDisplayingFilenameProps> = (
	props
) => {
	const { fileName, onFilenameChanged } = props;

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
				{/* TODO: show error notification on invalid input */}
				<Text
					fontWeight='bold'
					variant='h5'
					editable
					minLength={3}
					editableTextDidChange={(_, curr) => {
						if (onFilenameChanged) onFilenameChanged(curr);
					}}
				>
					{fileName}
				</Text>
				{props.children}
			</Box>
		</TopBar>
	);
};

export default TopBarDisplayingFilename;
