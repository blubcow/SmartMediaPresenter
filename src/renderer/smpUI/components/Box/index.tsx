import React, { PropsWithChildren } from 'react';
import { Box as MUIBox, BoxProps, ButtonBase } from '@mui/material';

export interface IBoxProps extends BoxProps {
	clickable?: boolean;
}

const Box: React.FC<PropsWithChildren<IBoxProps>> = React.forwardRef(
	(props, ref) => {
		const { clickable = false, ...muiBoxProps } = props;

		return (
			<MUIBox {...muiBoxProps} ref={ref}>
				{clickable && (
					<ButtonBase
						style={{
							height: '100%',
							width: '100%',
							position: 'absolute',
							top: 0,
							left: 0,
						}}
					/>
				)}
				{props.children}
			</MUIBox>
		);
	}
);

export default Box;
