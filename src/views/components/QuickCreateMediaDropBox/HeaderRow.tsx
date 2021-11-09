import React from 'react';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreate';
import { Box, Text } from '../../../smpUI/components';
import { useHeaderRowStyles } from './styles';

interface IHeaderRowProps {
	addFilesAction: () => void;
}

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
	const { addFilesAction } = props;
	const classes = useHeaderRowStyles();

	return (
		<Box className={classes.container}>
			<Text className={classes.addFiles} onClick={addFilesAction}>
				add files
			</Text>
		</Box>
	);
};

export default HeaderRow;
