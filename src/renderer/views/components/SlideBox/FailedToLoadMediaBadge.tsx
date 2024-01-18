import React from 'react';
import { Box, Text } from '../../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { Error } from '@mui/icons-material';
import { useFailedToLoadMediaBadgeStyles } from './styles';

interface IFailedToLoadMediaBadgeProps {
	amount: number;
}

const FailedToLoadMediaBadge: React.FC<IFailedToLoadMediaBadgeProps> = (
	props
) => {
	const { amount } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const classes = useFailedToLoadMediaBadgeStyles();

	return (
		<Box className={classes.container}>
			<Error className={classes.error} />
			<Text variant='caption'>
				{t(amount > 1 ? 'failedToLoadMediaMult' : 'failedToLoadMedia', {
					amount: amount,
				})}
			</Text>
		</Box>
	);
};

export default FailedToLoadMediaBadge;
