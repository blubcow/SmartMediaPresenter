import React from 'react';
import { Box } from '../../smpUI';
import { PresentationSyncStatus } from '../../shared/presentaitonSycncing.interface';
import { CloudUpload, CloudDone, CloudDownload } from '@mui/icons-material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			height: '65px',
			width: '65px',
			minWidth: '65px',
			borderRadius: '50%',
			outlineColor: theme.palette.text.primary,
			outlineStyle: 'solid',
			outlineWidth: '1px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: theme.palette.background.paper,
			},
		},
		icon: {
			fontSize: '30px',
		},
	})
);


interface IPresentationSyncingButtonProps {
	status: PresentationSyncStatus;
	onDownload: () => void;
	onUpload: () => void;
}

const PresentationSyncingButton: React.FC<IPresentationSyncingButtonProps> = (
	props
) => {
	const { status, onDownload, onUpload } = props;
	const classes = useStyles();

	return (
		<Box
			className={classes.button}
			onClick={
				status === 'insync'
					? undefined
					: status === 'downloadable'
					? onDownload
					: onUpload
			}
		>
			{status === 'insync' ? (
				<CloudDone className={classes.icon} sx={{ color: 'primary.main' }} />
			) : status === 'downloadable' ? (
				<CloudDownload
					className={classes.icon}
					sx={{ color: 'secondary.main' }}
				/>
			) : (
				<CloudUpload
					className={classes.icon}
					sx={{ color: 'secondary.main' }}
				/>
			)}
		</Box>
	);
};

export default PresentationSyncingButton;
