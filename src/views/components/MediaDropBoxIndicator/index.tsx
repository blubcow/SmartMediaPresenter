import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';
import { Box, Text } from '../../../smpUI/components';
import { IBoxProps } from '../../../smpUI/components/Box';
import useStyles from './styles';

interface IMediaDropBoxIndicatorProps extends IBoxProps {
	canTapToOpenFileInspector?: boolean;
	label?: string;
	labelSize?: 'h5' | 'h6' | 'body1';
}

const MediaDropBoxIndicator: React.FC<IMediaDropBoxIndicatorProps> = (
	props
) => {
	const { t } = useTranslation([i18nNamespace.Presentation]);
	const {
		label = `${t('dropMediaHere')}`,
		labelSize,
		canTapToOpenFileInspector = false,
	} = props;
	const classes = useStyles();

	return (
		<Box className={classes.droppingArea} {...props}>
			<Box className={classes.droppingAreaFrame}>
				<Text
					variant={labelSize ?? canTapToOpenFileInspector ? 'body1' : 'h5'}
					textAlign='center'
				>
					{label}
				</Text>
				{canTapToOpenFileInspector && (
					<Text variant='caption'>{t('orClickToChooseFromFileInspector')}</Text>
				)}
			</Box>
		</Box>
	);
};

export default MediaDropBoxIndicator;
