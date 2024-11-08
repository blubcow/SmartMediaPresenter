import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import MediaDropBoxIndicator from '../components/MediaDropBoxIndicator';

const useMultiInsertionStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			height: '100%',
			width: '100%',
			display: 'flex',
		},
		insertionColumn: {
			height: '100%',
			width: '50%',
			padding: theme.spacing(1),
		},
	})
);


interface IMultiInsertionProps {
	onMediaReceived: (
		column: number,
		event: React.DragEvent<HTMLDivElement>
	) => void;
}

const MultiInsertion: React.FC<IMultiInsertionProps> = (props) => {
	const { onMediaReceived } = props;

	const classes = useMultiInsertionStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box className={classes.container}>
			<Box
				className={classes.insertionColumn}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					onMediaReceived(0, e);
				}}
			>
				<MediaDropBoxIndicator
					bgcolor='divider'
					label={t('dropToFillColumn')}
					labelSize='body1'
				/>
			</Box>
			<Box
				className={classes.insertionColumn}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					onMediaReceived(1, e);
				}}
			>
				<MediaDropBoxIndicator
					bgcolor='divider'
					label={t('dropToFillColumn')}
					labelSize='body1'
				/>
			</Box>
		</Box>
	);
};

export default MultiInsertion;
