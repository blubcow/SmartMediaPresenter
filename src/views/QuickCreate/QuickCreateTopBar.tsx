import React from 'react';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';
import { Box, Button } from '../../smpUI/components';

interface IQuickCreateTopBarProps extends ITopBarDisplayingFilenameProps {}

const QuickCreateTopBar: React.FC<IQuickCreateTopBarProps> = (props) => {
	return (
		<TopBarDisplayingFilename {...props}>
			<Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
				<Box />
				<Button variant='contained'>create presentation</Button>
			</Box>
		</TopBarDisplayingFilename>
	);
};

export default QuickCreateTopBar;
