import { Button, ButtonProps, LinearProgress } from "@mui/material";
import { PropsWithChildren } from "react";

interface ProgressButtonProps extends ButtonProps {
    isLoading: boolean;
}

const ProgressButton: React.FC<PropsWithChildren<ProgressButtonProps>> = ({children, ...props}) => {
	const { isLoading = false, ...buttonProps } = props;

	return (
		<Button {...buttonProps}>
			{isLoading ? (
				<LinearProgress
					color={ buttonProps.variant == 'contained' ? 'secondary' : buttonProps.color }
					style={{ width: '100%' }}
				/>
			) : (
				children
			)}
		</Button>
	);
};

export default ProgressButton;
