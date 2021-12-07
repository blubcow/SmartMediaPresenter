import React from 'react';
import { TopBar } from '../../../smpUI/layout';
import { Box, Text } from '../../../smpUI/components';
import { ITopBarProps } from '../../../smpUI/layout/Bar/TopBar';

export interface ITopBarDisplayingFilenameProps extends ITopBarProps {
	fileName?: string;
	onFilenameChanged?: (filename: string) => void;
	onGoBack?: () => void;
}

const TopBarDisplayingFilename: React.FC<ITopBarDisplayingFilenameProps> = (
	props
) => {
	const { fileName, onFilenameChanged, onGoBack } = props;

	return (
		<TopBar canGoBack onGoBack={onGoBack} {...props}>
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
					style={{ minWidth: '25%' }}
					fontWeight='bold'
					variant='h5'
					color='text.primary'
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
