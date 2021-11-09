import React from 'react';
import { Box, Text, TextField } from '../../../smpUI/components';
import { useHeaderRowStyles } from './styles';

interface IHeaderRowProps {
	addFilesAction: () => void;
	searchTerm: string;
	onSearchTermUpdate: (event: React.ChangeEvent<any>) => void;
}

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
	const { addFilesAction, searchTerm, onSearchTermUpdate } = props;
	const classes = useHeaderRowStyles();

	return (
		<Box className={classes.container}>
			<Text className={classes.addFiles} onClick={addFilesAction}>
				add files
			</Text>
			<TextField
				className={classes.searchInput}
				label='search'
				value={searchTerm}
				onChange={(e) => {
					onSearchTermUpdate(e);
				}}
			/>
		</Box>
	);
};

export default HeaderRow;
