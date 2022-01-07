import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { CircularProgress } from '@mui/material';
import { useLoadingIndicatorStyles } from './styles';

const LoadingIndicator: React.FC<{}> = () => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const classes = useLoadingIndicatorStyles();

	return (
		<Box className={classes.container}>
			<CircularProgress className={classes.spinner} variant='indeterminate' />
			<Text>{t('fetchingMedia')}</Text>
		</Box>
	);
};

export default LoadingIndicator;
