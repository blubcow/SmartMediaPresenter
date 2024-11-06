import React from 'react';
import { Box, Text } from '../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { CircularProgress } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(1),
			backgroundColor: theme.palette.background.paper,
			borderRadius: theme.shape.borderRadius,
			display: 'flex',
			position: 'absolute',
			marginLeft: 'auto',
			textAlign: 'center',
			left: '50%',
			bottom: theme.spacing(2),
			outlineWidth: '1px',
			outlineColor: theme.palette.primary.main,
			outlineStyle: 'solid',
			alignItems: 'center',
			zIndex: 100,
			// center the badge horizontally
			transform: 'translate(-50%, 0)',
		},
		spinner: {
			marginRight: theme.spacing(2),
		},
	})
);

const LoadingIndicator: React.FC<{}> = () => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const classes = useStyles();

	return (
		<Box className={classes.container}>
			<CircularProgress className={classes.spinner} variant='indeterminate' />
			<Text>{t('fetchingMedia')}</Text>
		</Box>
	);
};

export default LoadingIndicator;
