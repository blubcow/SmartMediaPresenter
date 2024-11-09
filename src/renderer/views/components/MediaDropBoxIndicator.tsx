import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nNamespace } from '../../i18n/i18n';
import EditableText from '../../smpUI/EditableText';
import { Box, BoxProps} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		droppingArea: {
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			padding: theme.spacing(1),
		},
		droppingAreaFrame: {
			height: '100%',
			width: '100%',
			border: '3px dashed ' + theme.palette.background.paper,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			padding: theme.spacing(1),
		},
		droppingAreaFrameActive: {
			height: '100%',
			width: '100%',
			border: '3px dashed ' + theme.palette.primary.main,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			padding: theme.spacing(1),
		},
		text: {
			pointerEvents: 'none',
		},
	})
);


interface IMediaDropBoxIndicatorProps extends BoxProps {
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
		...boxProps
	} = props;
	const [draggedOver, setDraggedOver] = useState<boolean>(false);
	const classes = useStyles();

	return (
		<Box className={classes.droppingArea} {...boxProps}>
			<Box
				className={
					draggedOver
						? classes.droppingAreaFrameActive
						: classes.droppingAreaFrame
				}
				onDragEnter={() => setDraggedOver(true)}
				onDragLeave={() => setDraggedOver(false)}
			>
				<EditableText
					className={classes.text}
					variant={labelSize ?? canTapToOpenFileInspector ? 'body1' : 'h5'}
					textAlign='center'
				>
					{label}
				</EditableText>
				{canTapToOpenFileInspector && (
					<EditableText className={classes.text} variant='caption'>
						{t('orClickToChooseFromFileInspector')}
					</EditableText>
				)}
			</Box>
		</Box>
	);
};

export default MediaDropBoxIndicator;
