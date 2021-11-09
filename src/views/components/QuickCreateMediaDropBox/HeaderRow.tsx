import { SelectChangeEvent } from '@mui/material';
import React from 'react';
import {
	Box,
	Text,
	TextField,
	SelectionPickerOption,
	SelectionPicker,
} from '../../../smpUI/components';
import { useHeaderRowStyles } from './styles';

interface IHeaderRowProps {
	addFilesAction: () => void;
	searchTerm: string;
	onSearchTermUpdate: (event: React.ChangeEvent<any>) => void;
	orderByOptions: string[];
	orderByValue: string;
	onOrderByChange: (value: string) => void;
	orderOptions: string[];
	orderValue: string;
	onOrderChange: (value: string) => void;
}

const HeaderRow: React.FC<IHeaderRowProps> = (props) => {
	const {
		addFilesAction,
		searchTerm,
		onSearchTermUpdate,
		orderByOptions,
		orderByValue,
		onOrderByChange,
		orderOptions,
		orderValue,
		onOrderChange,
	} = props;
	const classes = useHeaderRowStyles();

	return (
		<Box className={classes.container}>
			<Text className={classes.addFiles} onClick={addFilesAction}>
				add files
			</Text>

			<TextField
				className={classes.searchInput}
				label='search'
				value={searchTerm}
				onChange={(e) => {
					onSearchTermUpdate(e);
				}}
			/>

			<Box className={classes.orderingContainer}>
				<SelectionPicker
					label='order by'
					value={orderByValue}
					onChange={(e) => {
						onOrderByChange((e.target.value as string) ?? '');
					}}
				>
					{orderByOptions.map((option) => (
						<SelectionPickerOption key={option} value={option}>
							{option}
						</SelectionPickerOption>
					))}
				</SelectionPicker>
				<Box className={classes.spacer} />
				<SelectionPicker
					value={orderValue}
					onChange={(e) => {
						onOrderChange((e.target.value as string) ?? '');
					}}
				>
					{orderOptions.map((option) => (
						<SelectionPickerOption key={option} value={option}>
							{option}
						</SelectionPickerOption>
					))}
				</SelectionPicker>
			</Box>
		</Box>
	);
};

export default HeaderRow;
