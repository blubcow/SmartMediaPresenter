import React from 'react';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';

interface IQuickCreateTopBarProps extends ITopBarDisplayingFilenameProps {}

const QuickCreateTopBar: React.FC<IQuickCreateTopBarProps> = (props) => {
	return <TopBarDisplayingFilename {...props} />;
};

export default QuickCreateTopBar;
