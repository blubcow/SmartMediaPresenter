import React from 'react';
import TopBarDisplayingFilename, {
	ITopBarDisplayingFilenameProps,
} from '../components/appBars/TopBarDisplayingFilename';
import { Box, Button } from '../../smpUI/components';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';

interface IQuickCreateTopBarProps extends ITopBarDisplayingFilenameProps {
	onCreatePresentation: () => void;
}

const QuickCreateTopBar: React.FC<IQuickCreateTopBarProps> = (props) => {
	const { onCreatePresentation, ...topBarDisplayingFilenameProps } = props;
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<TopBarDisplayingFilename {...topBarDisplayingFilenameProps}>
			<Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
				<Box />
				<Button variant='contained' onClick={onCreatePresentation}>
					{t('createPresentation')}
				</Button>
			</Box>
		</TopBarDisplayingFilename>
	);
};

export default QuickCreateTopBar;
