import React from 'react';
import { Drawer, Box, Button } from '../../../smpUI/components';
import { IDrawerProps } from '../../../smpUI/components/Drawer';
import BackgroundAudio from './slideThemeComponents/BackgroundAudio';
import DefaultBackgroundColor from './slideThemeComponents/DefaultBackgroundColor';
import DefaultFont from './slideThemeComponents/DefaultFont';
import DefaultFontColor from './slideThemeComponents/DefaultFontColor';
import DefaultFontSize from './slideThemeComponents/DefaultFontSize';
import DefaultFormat from './slideThemeComponents/DefaultFormat';
import DefaultPlaybackTime from './slideThemeComponents/DefaultPlaybackTime';
import { useEditThemeDrawerStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../../i18n/i18n';

interface IEditThemeDrawerProps extends IDrawerProps {
	onFinish: () => void;
}

const EditThemeDrawer: React.FC<IEditThemeDrawerProps> = (props) => {
	const { onFinish } = props;
	const classes = useEditThemeDrawerStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Drawer className={classes.container} {...props}>
			<Box className={classes.content}>
				<Box className={classes.rowContainer}>
					<DefaultBackgroundColor />
					<DefaultFormat />
					<DefaultPlaybackTime />
					<BackgroundAudio />
					<DefaultFont />
					<DefaultFontSize />
					<DefaultFontColor />
				</Box>
				<Box className={classes.btnContainer}>
					<Button variant='contained' onClick={onFinish}>
						{t('finsih')}
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default EditThemeDrawer;
