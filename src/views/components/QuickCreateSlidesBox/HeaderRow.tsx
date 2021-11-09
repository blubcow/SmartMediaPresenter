import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useHedaerRowStyles } from './styles';

interface IHeaderProps {
	onSlideAdded: () => void;
}
const HeaderRow: React.FC<IHeaderProps> = (props) => {
	const { onSlideAdded } = props;
	const classes = useHedaerRowStyles();

	return (
		<Box className={classes.container} onClick={onSlideAdded}>
			<Text>add new slide</Text>
		</Box>
	);
};

export default HeaderRow;
