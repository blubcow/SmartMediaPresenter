import React from 'react';
import { Box } from '../../../smpUI/components';
import { PresentationSyncStatus } from '../../../types/presentaitonSycncing';
import useStyles from './styles';
import { CloudUpload, CloudDone, CloudDownload } from '@mui/icons-material';

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
