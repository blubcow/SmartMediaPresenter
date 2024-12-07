import React from 'react';
import { useTranslation } from 'react-i18next';
import useRemoteUserContext from '../../hooks/useRemoteUserContext';
import { i18nNamespace } from '../../i18n/i18n';
import { EditableText } from '../../smpUI/EditableText';
import { useHeaderRowStyles } from './styles';
import { MenuItem, Switch, TextField } from '@mui/material';
import { Box } from '@mui/material';
import { SelectionFormControl } from '../../smpUI/SelectionFormControl';

interface IHeaderRowProps {
	addFilesAction: () => void;
	chooseCloudAction: (cloud: boolean) => void;
	cloud: boolean;
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
		chooseCloudAction,
		cloud,
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
	const { userLoggedIn } = useRemoteUserContext();

	return (
		<Box className={classes.container}>
			<Box className={classes.labelBtnContainer}>
				{!cloud && (
					<EditableText
						fontWeight={800}
						className={classes.labelBtn}
						onClick={addFilesAction}
					>
						{t('addFiles')}
					</EditableText>
				)}
				{userLoggedIn && (
					<EditableText
						fontWeight={800}
						className={classes.labelBtn}
						onClick={() => chooseCloudAction(!cloud)}
					>
						{t(cloud ? 'chooseLocal' : 'chooseCloud')}
					</EditableText>
				)}
			</Box>
			<Box
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
			>
				<EditableText variant='caption'>{t('preview')}</EditableText>
				<Switch
					checked={mediaPreviewEnabled}
					onChange={(e) => {
						onMediaPreviewEnabledDidChange(e.target.checked);
					}}
				/>
			</Box>
			{!cloud && (
				<>
					<TextField
						className={classes.searchInput}
						label={t('search')}
						value={searchTerm}
						onChange={(e) => {
							onSearchTermUpdate(e);
						}}
					/>

					<Box className={classes.orderingContainer}>
						<SelectionFormControl
							label={t('ordering:orderBy')}
							value={orderByValue}
							onChange={(e) => {
								onOrderByChange((e.target.value as string) ?? '');
							}}
						>
							{orderByOptions.map((option) => (
								<MenuItem key={option} value={option}>{option}</MenuItem>
							))}
						</SelectionFormControl>

						<Box className={classes.spacer} />

						<SelectionFormControl
							label="TODO: THIS LABEL WAS NOT SET??" // TODO: Label was not set
							value={orderValue}
							onChange={(e) => {
								onOrderChange((e.target.value as string) ?? '');
							}}
						>
							{orderOptions.map((option) => (
								<MenuItem key={option} value={option}>{option}</MenuItem>
							))}
						</SelectionFormControl>
					</Box>
				</>
			)}
		</Box>
	);
};

export default HeaderRow;
