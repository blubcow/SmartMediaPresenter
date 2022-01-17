import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		container: {
			width: '850px',
			height: '70vh',
			display: 'flex',
			flexDirection: 'column',
			overflowX: 'visible',
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingBottom: theme.spacing(3),
		},
		headerBtnContainer: {
			display: 'flex',
			alignItems: 'center',
			gap: theme.spacing(1),
		},
		btnIcon: {
			marginRight: theme.spacing(0.5),
		},
		content: {
			flex: 1,
			position: 'relative',
			display: 'grid',
			gridTemplateColumns: 'repeat(5, 1fr)',
			gridAutoRows: 'minmax(min-content, max-content)',
			gridGap: theme.spacing(3),
			paddingTop: theme.spacing(3),
			paddingBottom: theme.spacing(3),
			padding: theme.spacing(1),
			overflowY: 'scroll',
		},
		loadingIndicator: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
		emptyFolderIndicator: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
		footerBtnContainer: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingTop: theme.spacing(3),
		},
		folderNavigator: {
			display: 'flex',
			gap: theme.spacing(1),
			alignItems: 'center',
		},
		newFolderContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
			width: '250px',
		},
		deletingModal: {
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			justifyContent: 'center',
			alignItems: 'center',
		},
	})
);

export const useFileStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '200px',
			overflow: 'hidden',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: theme.spacing(1),
			cursor: 'pointer',
			borderRadius: theme.shape.borderRadius,
			padding: theme.spacing(1),
			boxShadow: theme.shadows[5],
			transition: 'box-shadow 0.2s ease',
			textOverflow: 'ellipsis',
			'&:hover': {
				boxShadow: theme.shadows[20],
			},
		},
		fileTypeContainer: {
			height: '50%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			maxWidth: '80%',
			maxHeight: '120px',
			pointerEvents: 'none',
			userSelect: 'none',
		},
		img: {
			maxWidth: '100%',
			maxHeight: '100%',
			pointerEvents: 'none',
		},
		icon: {
			color: theme.palette.text.primary,
			fontSize: '80px',
		},
		nameContainer: {
			maxHeight: '50%',
			textOverflow: 'ellipsis',
			overflowWrap: 'break-word',
			textAlign: 'center',
			width: '100%',
			pointerEvents: 'none',
			userSelect: 'none',
		},
	})
);
