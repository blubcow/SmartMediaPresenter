import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles<Theme>((theme: Theme) =>
	createStyles({
		img: {
			maxWidth: '100%',
			maxHeight: '100%',
			zIndex: 1,
			outlineWidth: '0px',
			backgroundColor: 'divider',
			position: 'relative',
			userSelect: 'none',
		},
		imgSelected: {
			maxWidth: '100%',
			maxHeight: '100%',
			zIndex: 2,
			outlineColor: 'white',
			outline: '3px dashed',
			overflow: 'overlay',
			userSelect: 'none',
		},
	})
);
