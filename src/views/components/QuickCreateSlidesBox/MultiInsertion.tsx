import React from 'react';
import { Box } from '../../../smpUI/components';
import { useMultiInsertionStyles } from './styles';
import MediaDropBoxIndicator from '../MediaDropBoxIndicator';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreate';

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
