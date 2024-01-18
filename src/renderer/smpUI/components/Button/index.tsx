import React from 'react';
import {
	Button as MUIButton,
	ButtonProps,
	LinearProgress,
} from '@mui/material';

interface IButtonProps extends ButtonProps {
	isLoading?: boolean;
	minWidth?: string;
}

const Button: React.FC<IButtonProps> = (props) => {
	const { isLoading = false, minWidth = '150px', variant, color } = props;

	return (
		<MUIButton
			style={{
				minHeight: '45px',
				minWidth: minWidth,
				fontWeight: variant === 'contained' ? 800 : 500,
			}}
			{...props}
		>
			{isLoading ? (
				<LinearProgress
					color={variant !== 'contained' ? color : 'secondary'}
					style={{ width: '100%' }}
				/>
			) : (
				props.children
			)}
		</MUIButton>
	);
};

export default Button;
