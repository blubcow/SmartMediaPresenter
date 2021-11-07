import React, { useState } from 'react';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreate';
import { Box, Text } from '../../../smpUI/components';
import { IBoxProps } from '../../../smpUI/components/Box';
import useStyles, { useMediaRowStyles } from './styles';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';
import { DataTransferIdentifiers } from '../../../shared/types/identifiers';
import * as path from 'path';
import { allowedFiles } from '../../../shared/types/mediaResources';

interface IQuickCreateMediaDropBoxProps extends IBoxProps {}

const QuickCreateMediaDropBox: React.FC<IQuickCreateMediaDropBoxProps> = (
	props
) => {
	const [files, setFiles] = useState<QuickCreateMediaResource[]>([]);
	const classes = useStyles();
	const { getFilesInDir } = useLocalFileSystem();

	const onDataDropped = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const timestamp = Date.now();
		let newFiles: QuickCreateMediaResource[] = [...files];
		await Promise.all(
			Array.prototype.map.call(event.dataTransfer.files, async (file: File) => {
				//@ts-ignore
				const filePath = file.path;
				if (path.extname(file.name).length) {
					if (allowedFiles.includes(path.extname(file.name)))
						newFiles.push({
							name: file.name,
							location: { local: 'file://' + filePath },
							added: timestamp,
						});
				} else {
					const filesInDir = await getFilesInDir(filePath);
					console.log(filesInDir);
					newFiles = [...newFiles, ...filesInDir];
				}
			})
		);

		setFiles([...newFiles.sort((a, b) => (a.added < b.added ? 1 : -1))]);
	};

	return (
		<Box
			{...props}
			className={classes.container}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDragLeave={(e) => {
				e.preventDefault();
			}}
			onDragEnter={(e) => {
				e.preventDefault();
			}}
			onDrop={onDataDropped}
		>
			<HeaderRow />
			{files.length ? (
				files.map((file, i) => <MediaRow key={i} id={i} media={files[i]} />)
			) : (
				<Box className={classes.infoText}>
					<Text variant='h6'>drop media here</Text>
				</Box>
			)}
		</Box>
	);
};

const HeaderRow = () => {
	return (
		<Box
			sx={{
				width: '100%',
				minHeight: '55px',
				bgcolor: 'background.paper',
				position: 'sticky',
				top: 0,
			}}
		></Box>
	);
};

const MediaRow = (props: { media: QuickCreateMediaResource; id: number }) => {
	const { media, id } = props;
	const classes = useMediaRowStyles();

	return (
		<Box
			className={classes.container}
			sx={{
				bgcolor: id % 2 ? 'transparent' : 'divider',
			}}
		>
			<Box
				className={classes.row}
				draggable
				onDragStart={(e) => {
					e.dataTransfer.setData(
						DataTransferIdentifiers.MediaFileInfo,
						JSON.stringify(media)
					);
				}}
			>
				<Box className={classes.imgContainer}>
					<img
						className={classes.img}
						src={media.location.local ?? media.location.remote}
					/>
				</Box>
				<Box className={classes.txtContainer}>
					<Text>{media.name}</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default QuickCreateMediaDropBox;
