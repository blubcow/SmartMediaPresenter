import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles((theme: Theme) =>
	createStyles({
		img: {
			maxWidth: '100%',
			maxHeight: '100%',
			zIndex: 1,
			outlineWidth: '0px',
			backgroundColor: 'divider',
			position: 'relative',
			userSelect: 'none',
			objectFit: 'contain',
		},
	})
);

export const useActiveMediaIndicatorStyles = makeStyles((theme: Theme) =>
	createStyles({
		indicator: {
			outlineWidth: '2px',
			outlineStyle: 'dashed',
			borderWidth: '1px',
			borderStyle: 'solid',
			position: 'absolute',
			pointerEvents: 'none',
			touchAction: 'none',
			zIndex: 50,
		},
	})
);
