import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useUserSettingsDrawerStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			minWidth: '450px',
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			padding: theme.spacing(1),
		},
	})
);
