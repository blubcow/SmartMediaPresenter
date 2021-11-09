import React, { useState } from 'react';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreate';
import { Box, Text } from '../../../smpUI/components';
import { IBoxProps } from '../../../smpUI/components/Box';
import useStyles from './styles';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';
import * as path from 'path';
import HeaderRow from './HeaderRow';
import MediaRow from './MeidaRow';
import { allowedFiles } from '../../../shared/types/mediaResources';

interface IQuickCreateMediaDropBoxProps extends IBoxProps {}

const QuickCreateMediaDropBox: React.FC<IQuickCreateMediaDropBoxProps> = (
	props
) => {
	const [files, setFiles] = useState<QuickCreateMediaResource[]>([]);
	const classes = useStyles();
	const { getFilesInDir, openFileSelectorDialog } = useLocalFileSystem();

	const onDataDropped = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const timestamp = Date.now();
		let newFiles: QuickCreateMediaResource[] = [];
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
					const filesInDir: QuickCreateMediaResource[] = await getFilesInDir(
						filePath
					);
					console.log(filesInDir);
					newFiles = [...newFiles, ...filesInDir];
				}
			})
		);
		onFilesReceivedMerge(newFiles);
	};

	const onFilesReceivedMerge = (newFiles: QuickCreateMediaResource[]) => {
		const filteredFiles = newFiles.filter((file) =>
			allowedFiles.includes(path.extname(file.name))
		);
		const filesToInsert = [
			...files.filter(
				(file) =>
					filteredFiles.find(
						(fileInDir) =>
							fileInDir.name === file.name &&
							(fileInDir.location.local === file.location.local ||
								fileInDir.location.remote === file.location.remote)
					) === undefined
			),
			...filteredFiles,
		];

		setFiles([...filesToInsert.sort((a, b) => (a.added < b.added ? 1 : -1))]);
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
			<HeaderRow
				addFilesAction={async () => {
					const files: QuickCreateMediaResource[] =
						await openFileSelectorDialog();
					onFilesReceivedMerge(files);
				}}
			/>
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

export default QuickCreateMediaDropBox;