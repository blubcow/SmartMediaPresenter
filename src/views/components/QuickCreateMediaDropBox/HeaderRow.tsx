import { on } from 'events';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import {
	Box,
	Text,
	TextField,
	SelectionPickerOption,
	SelectionPicker,
	Switch,
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
	mediaPreviewEnabled: boolean;
	onMediaPreviewEnabledDidChange: (enabled: boolean) => void;
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
		mediaPreviewEnabled,
		onMediaPreviewEnabledDidChange,
	} = props;
	const classes = useHeaderRowStyles();
	const { t } = useTranslation([
		i18nNamespace.Presentation,
		i18nNamespace.Ordering,
	]);

	return (
		<Box className={classes.container}>
			<Text className={classes.addFiles} onClick={addFilesAction}>
				{t('addFiles')}
			</Text>

			<Box
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
			>
				<Text variant='caption'>{t('preview')}</Text>
				<Switch
					checked={mediaPreviewEnabled}
					onChange={(e) => {
						onMediaPreviewEnabledDidChange(e.target.checked);
					}}
				/>
			</Box>

			<TextField
				className={classes.searchInput}
				label={t('search')}
				value={searchTerm}
				onChange={(e) => {
					onSearchTermUpdate(e);
				}}
			/>

			<Box className={classes.orderingContainer}>
				<SelectionPicker
					label={t('ordering:orderBy')}
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
