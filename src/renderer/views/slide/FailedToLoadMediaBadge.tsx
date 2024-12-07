import React from 'react';
import { EditableText } from '../../smpUI/EditableText';
import { Box} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { Error } from '@mui/icons-material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useFailedToLoadMediaBadgeStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: theme.spacing(1),
			backgroundColor: theme.palette.background.paper,
			borderRadius: theme.shape.borderRadius,
			display: 'flex',
			position: 'absolute',
			marginLeft: 'auto',
			textAlign: 'center',
			right: theme.spacing(2),
			bottom: theme.spacing(2),
			outlineWidth: '1px',
			outlineColor: theme.palette.error.main,
			outlineStyle: 'solid',
			alignItems: 'center',
			zIndex: 100,
		},
		error: {
			marginRight: theme.spacing(1),
			color: theme.palette.error.main,
		},
	})
);


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
			<EditableText variant='caption'>
				{t(amount > 1 ? 'failedToLoadMediaMult' : 'failedToLoadMedia', {
					amount: amount,
				})}
			</EditableText>
		</Box>
	);
};

export default FailedToLoadMediaBadge;
