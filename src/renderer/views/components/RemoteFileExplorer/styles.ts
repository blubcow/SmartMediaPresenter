import { createStyles, makeStyles, Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '50vw',
			height: '50vh',
			display: 'flex',
			flexDirection: 'column',
		},
		header: {
			width: '100%',
			paddingBottom: theme.spacing(3),
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		content: {
			width: '100%',
			flex: 1,
			position: 'relative',
			overflowY: 'scroll',
			padding: theme.spacing(3),
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)',
			gridAutoRows: 'minmax(min-content, max-content)',
			gridGap: theme.spacing(3),
		},
		indicator: {
			position: 'absolute',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		},
	})
);
