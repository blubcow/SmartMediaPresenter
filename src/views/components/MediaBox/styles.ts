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
	})
);

export const useActiveMediaIndicatorStyles = makeStyles((theme: Theme) =>
	createStyles({
		indicator: {
			outlineWidth: '2px',
			outlineStyle: 'dashed',
			outlineColor: 'white',
			borderWidth: '2px',
			borderStyle: 'solid',
			borderColor: theme.palette.primary.main,
			position: 'absolute',
			pointerEvents: 'none',
			touchAction: 'none',
			zIndex: 50,
		},
	})
);
