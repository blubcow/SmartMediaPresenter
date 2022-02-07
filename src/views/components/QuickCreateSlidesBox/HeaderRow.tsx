import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useHedaerRowStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { Divider, Switch } from '@mui/material';

interface IHeaderProps {
	onSlideAdded: () => void;
	orderedInserting: boolean;
	changeOrderedInserting: (ordered: boolean) => void;
}
const HeaderRow: React.FC<IHeaderProps> = (props) => {
	const { onSlideAdded, orderedInserting, changeOrderedInserting } = props;
	const classes = useHedaerRowStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box className={classes.container}>
			<Box
				className={classes.alphapeticalInsert}
				onClick={() => changeOrderedInserting(!orderedInserting)}
			>
				<Switch checked={orderedInserting} /> <Text>{t('orderedInsert')}</Text>
			</Box>
			<Box className={classes.addNewSlide} onClick={onSlideAdded}>
				<Text>{t('addNewSlide')}</Text>
			</Box>
		</Box>
	);
};

export default HeaderRow;
