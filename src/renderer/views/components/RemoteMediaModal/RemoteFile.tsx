import React, { useEffect, useState, useCallback } from 'react';
import {
	Modal,
	Box,
	Button,
	Text,
	IconButton,
} from '../../../smpUI/components';
import {
	RemoteStorageMedia,
	RemoteStorageMediaType,
} from '../../../types/presentaitonSycncing';
import { InsertDriveFile, Folder, ArrowBack } from '@mui/icons-material';
import { ImageResourceExtensions } from '../../../shared/types/mediaResources';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
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


interface IFileProps {
	name: string;
	imgUrl?: string;
	selected: boolean;
	onClick: () => void;
	changeDir: () => void;
	type: RemoteStorageMediaType;
}

const RemoteFile: React.FC<IFileProps> = (props) => {
	const { name, imgUrl, selected, onClick, changeDir, type } = props;
	const classes = useStyles();
	const [fileExtension] = useState<string>(name.split('.').pop() ?? '');

	return (
		<Box
			className={classes.container}
			sx={{
				backgroundColor: selected ? 'background.default' : undefined,
			}}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			onDoubleClick={(e) => {
				e.stopPropagation();
				if (fileExtension === name) changeDir();
			}}
		>
			<Box className={classes.fileTypeContainer}>
				{type !== 'dir' ? (
					ImageResourceExtensions.includes(fileExtension.toLowerCase()) ? (
						<img className={classes.img} src={imgUrl} loading='lazy' />
					) : (
						<InsertDriveFile className={classes.icon} />
					)
				) : (
					<Folder className={classes.icon} />
				)}
			</Box>
			<Text
				variant='caption'
				fontWeight={700}
				className={classes.nameContainer}
			>
				{name}
			</Text>
		</Box>
	);
};

export default RemoteFile;
