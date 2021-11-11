import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useHedaerRowStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface IHeaderProps {
	onSlideAdded: () => void;
}
const HeaderRow: React.FC<IHeaderProps> = (props) => {
	const { onSlideAdded } = props;
	const classes = useHedaerRowStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box className={classes.container} onClick={onSlideAdded}>
			<Text>{t('addNewSlide')}</Text>
		</Box>
	);
};

export default HeaderRow;
