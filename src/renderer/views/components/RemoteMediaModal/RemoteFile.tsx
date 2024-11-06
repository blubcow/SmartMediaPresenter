import React, { useEffect, useState, useCallback } from 'react';
import {
	Modal,
	Box,
	Button,
	Text,
	IconButton,
} from '../../../smpUI/components';
import useStyles, { useFileStyles } from './styles';
import {
	RemoteStorageMedia,
	RemoteStorageMediaType,
} from '../../../types/presentaitonSycncing';
import { InsertDriveFile, Folder, ArrowBack } from '@mui/icons-material';
import { ImageResourceExtensions } from '../../../shared/types/mediaResources';

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
	const classes = useFileStyles();
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
