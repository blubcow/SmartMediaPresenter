import React, { useState, useEffect } from 'react';
import { QuickCreateMediaResource } from '../../../types/quickCreateMode';
import { Box, Text } from '../../../smpUI/components';
import { IBoxProps } from '../../../smpUI/components/Box';
import useStyles from './styles';
import { useLocalFileSystem } from '../../../hooks/useMainProcessMethods';
import * as path from 'path';
import HeaderRow from './HeaderRow';
import MediaRow from './MeidaRow';
import { allowedFiles } from '../../../shared/types/mediaResources';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import MediaDropBoxIndicator from '../MediaDropBoxIndicator';
import { useHeldKeys } from '../../../hooks/useHeldKeys';
import { DataTransferIdentifiers } from '../../../types/identifiers';
import RemoteFileExplorer from './RemoteFileExplorer';

interface IQuickCreateMediaDropBoxProps extends IBoxProps {
	selectedRows: number[];
	clearSelectedRows: () => void;
	onSelectedMediaChanged: (rows: number[]) => void;
	setMultiInsertionEnabled: (enabled: boolean) => void;
}

const QuickCreateMediaDropBox: React.FC<IQuickCreateMediaDropBoxProps> = (
	props
) => {
	const {
		onSelectedMediaChanged,
		selectedRows,
		clearSelectedRows,
		setMultiInsertionEnabled,
		...boxProps
	} = props;

	const [files, setFiles] = useState<QuickCreateMediaResource[]>([]);
	const [filteredFiles, setFilteredFiles] = useState<
		QuickCreateMediaResource[]
	>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const classes = useStyles();
	const { getFilesInDir, openFileSelectorDialog } = useLocalFileSystem();
	const { t } = useTranslation([
		i18nNamespace.Presentation,
		i18nNamespace.Ordering,
	]);
	const [orderByOptions] = useState<string[]>([
		t('ordering:added'),
		t('ordering:name'),
	]);
	const [orderByValue, setOrderByValue] = useState<string>(orderByOptions[0]);
	const [orderOptions] = useState<string[]>([
		t('ordering:ascending'),
		t('ordering:descending'),
	]);
	const [orderValue, setOrderValue] = useState<string>(orderOptions[0]);
	const [mediaPreviewEnabled, setMediaPreviewEnabled] = useState<boolean>(true);
	const { shift } = useHeldKeys();
	const [chooseFromCloud, setChooseFromCloud] = useState<boolean>(false);

	useEffect(() => {
		if (!searchTerm.replaceAll(' ', '').length) {
			setFilteredFiles([...sortFiles(files)]);
		} else {
			setFilteredFiles([
				...sortFiles(
					files.filter((file) =>
						file.name.toLowerCase().includes(searchTerm.toLowerCase())
					)
				),
			]);
		}
	}, [searchTerm, files]);

	useEffect(() => {
		setFilteredFiles([...sortFiles(filteredFiles)]);
	}, [orderByValue, orderValue]);

	const onDataDropped = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const timestamp = Date.now();
		let newFiles: QuickCreateMediaResource[] = [];
		await Promise.all(
			Array.prototype.map.call(event.dataTransfer.files, async (file: File) => {
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

		setFiles([...filesToInsert]);
	};

	const sortFiles = (files: QuickCreateMediaResource[]) => {
		const multip = orderValue === t('ordering:ascending') ? -1 : 1;
		return files.sort((a, b) =>
			orderByValue === t('ordering:added')
				? a.added < b.added
					? 1 * multip
					: -1 * multip
				: a.name < b.name
				? 1 * multip
				: -1 * multip
		);
	};

	return (
		<Box
			{...boxProps}
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
						await openFileSelectorDialog('mediaMultiSelect');
					onFilesReceivedMerge(files);
				}}
				searchTerm={searchTerm}
				chooseCloudAction={(cloud) => {
					setChooseFromCloud(cloud);
				}}
				cloud={chooseFromCloud}
				onSearchTermUpdate={(e) => {
					setSearchTerm(e.target.value ?? '');
				}}
				orderByOptions={orderByOptions}
				orderByValue={orderByValue}
				onOrderByChange={(value: string) => setOrderByValue(value)}
				orderOptions={orderOptions}
				orderValue={orderValue}
				onOrderChange={(value: string) => setOrderValue(value)}
				mediaPreviewEnabled={mediaPreviewEnabled}
				onMediaPreviewEnabledDidChange={(enabled) => {
					setMediaPreviewEnabled(enabled);
				}}
			/>
			{chooseFromCloud ? (
				<RemoteFileExplorer
					preview={mediaPreviewEnabled}
					setMultiInsertionEnabled={setMultiInsertionEnabled}
				/>
			) : (
				<Box className={classes.rowsContainer}>
					{filteredFiles.length ? (
						filteredFiles.map((file, i) => (
							<MediaRow
								key={i}
								id={i}
								media={file}
								onSelection={() => {
									if (shift) {
										const highestIndex = Math.max(...selectedRows);
										const lowestIndex = Math.min(...selectedRows);

										if (!(i > highestIndex || i < lowestIndex)) return;
										const start = i > highestIndex ? highestIndex : i;
										const end = i > highestIndex ? i + 1 : lowestIndex;
										const selectAllRowBetween = Array.from(
											{ length: end - start },
											(_, index) => start + index
										);

										onSelectedMediaChanged([
											...selectedRows,
											...selectAllRowBetween,
										]);
									} else {
										onSelectedMediaChanged([i]);
									}
								}}
								selected={selectedRows.includes(i)}
								onBlur={() => {
									if (shift) return;
									clearSelectedRows();
								}}
								onDragStart={(e) => {
									if (selectedRows.length > 1) {
										e.dataTransfer.setData(
											DataTransferIdentifiers.MultipleMediaFileInfo,
											JSON.stringify(
												filteredFiles.filter((_, index) =>
													selectedRows.includes(index)
												)
											)
										);
									} else {
										e.dataTransfer.setData(
											DataTransferIdentifiers.MediaFileInfo,
											JSON.stringify(file)
										);
									}
								}}
								previewEnabled={mediaPreviewEnabled}
							/>
						))
					) : files.length ? (
						<Box className={classes.infoText}>
							<Text variant='h6'>{t('noSearchResults')}</Text>
						</Box>
					) : (
						<MediaDropBoxIndicator />
					)}
				</Box>
			)}
		</Box>
	);
};

export default QuickCreateMediaDropBox;
