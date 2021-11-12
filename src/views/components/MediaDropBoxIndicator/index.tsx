import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { Box, Text } from '../../../smpUI/components';
import { IBoxProps } from '../../../smpUI/components/Box';
import useStyles from './styles';

interface IMediaDropBoxIndicatorProps extends IBoxProps {
	canTapToOpenFileInspector?: boolean;
}

const MediaDropBoxIndicator: React.FC<IMediaDropBoxIndicatorProps> = (
	props
) => {
	const { canTapToOpenFileInspector = false } = props;
	const classes = useStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Box className={classes.droppingArea} {...props}>
			<Box className={classes.droppingAreaFrame}>
				<Text variant={canTapToOpenFileInspector ? 'body1' : 'h5'}>
					{t('dropMediaHere')}
				</Text>
				{canTapToOpenFileInspector && (
					<Text variant='caption'>{t('orClickToChooseFromFileInspector')}</Text>
				)}
			</Box>
		</Box>
	);
};

export default MediaDropBoxIndicator;
