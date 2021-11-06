import React from 'react';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';

interface IEditTopBarProps extends ITopBarDisplayingFilenameProps {}

const EditTopBar: React.FC<IEditTopBarProps> = (props) => {
	const { fileName } = props;

	return <TopBarDisplayingFilename />;
};

export default EditTopBar;
