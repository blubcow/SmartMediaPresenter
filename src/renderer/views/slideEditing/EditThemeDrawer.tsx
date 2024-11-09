import React from 'react';
import { Box, Button} from '@mui/material';
import BackgroundAudio from './theme/BackgroundAudio';
import DefaultBackgroundColor from './theme/DefaultBackgroundColor';
import DefaultFont from './theme/DefaultFont';
import DefaultFontColor from './theme/DefaultFontColor';
import DefaultFontSize from './theme/DefaultFontSize';
import DefaultFormat from './theme/DefaultFormat';
import DefaultPlaybackTime from './theme/DefaultPlaybackTime';
import { useEditThemeDrawerStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import DefaultMediaAlignemnt from './theme/DefaultMediaAlignment';
import { Drawer, DrawerProps } from '@mui/material';

interface IEditThemeDrawerProps extends DrawerProps {
	onFinish: () => void;
}

const EditThemeDrawer: React.FC<IEditThemeDrawerProps> = (props) => {
	const { onFinish, ...drawerProps } = props;
	const classes = useEditThemeDrawerStyles();
	const { t } = useTranslation([i18nNamespace.Presentation]);

	return (
		<Drawer className={classes.container} {...drawerProps}>
			<Box className={classes.content}>
				<Box className={classes.rowContainer}>
					<DefaultBackgroundColor />
					<DefaultFormat />
					<DefaultPlaybackTime />
					<BackgroundAudio />
					<DefaultFont />
					<DefaultFontSize />
					<DefaultFontColor />
					<DefaultMediaAlignemnt />
				</Box>
				<Box className={classes.btnContainer}>
					<Button variant='contained' onClick={onFinish}>
						{t('finish')}
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default EditThemeDrawer;
