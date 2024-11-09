import React from 'react';
import EditableText from '../../../smpUI/EditableText';
import { Box} from '@mui/material';
import { ButtonBase } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export const useOptionRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		rowContainer: {
			minHeight: '50px',
			width: '100%',
		},
		btnBase: { width: '100%' },
		optionRow: {
			height: '100%',
			width: '100%',
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'row',
			alignContent: 'center',
			justifyContent: 'flex-start',
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: theme.palette.divider,
			},
		},
		optionRowIcon: {
			marginRight: theme.spacing(2),
		},
	})
);

interface IOptionRowProps {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
}

const OptionRow: React.FC<IOptionRowProps> = (props) => {
	const { icon, label, onClick } = props;
	const classes = useOptionRowStyles();

	return (
		<Box className={classes.rowContainer} onClick={onClick}>
			<ButtonBase className={classes.btnBase}>
				<Box className={classes.optionRow}>
					<Box className={classes.optionRowIcon}>{icon}</Box>
					<EditableText>{label}</EditableText>
				</Box>
			</ButtonBase>
		</Box>
	);
};

export default OptionRow;
