import React from 'react';
import EditableText from '../../smpUI/EditableText';
import { Box} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { Divider, Switch } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useHedaerRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '100%',
			padding: theme.spacing(1),
			position: 'sticky',
			top: 0,
			cursor: 'pointer',
			display: 'flex',
			backgroundColor: theme.palette.background.paper,
		},
		alphapeticalInsert: {
			flex: 1,
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			userSelect: 'none',
		},
		addNewSlide: {
			display: 'flex',
			flex: 1,
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			userSelect: 'none',
			'&:hover': {
				backgroundColor: theme.palette.divider,
			},
		},
	})
);

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
				<Switch checked={orderedInserting} /> <EditableText>{t('orderedInsert')}</EditableText>
			</Box>
			<Box className={classes.addNewSlide} onClick={onSlideAdded}>
				<EditableText>{t('addNewSlide')}</EditableText>
			</Box>
		</Box>
	);
};

export default HeaderRow;
