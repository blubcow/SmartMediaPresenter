import React from 'react';
import { Box } from '../../../smpUI/components';

type VerticalResizingAnchorPosition = 'top' | 'bottom';
type HorizontalResizingAnchorPosition = 'left' | 'right';
export type AnchorPosition = {
	vertical: VerticalResizingAnchorPosition;
	horizontal: HorizontalResizingAnchorPosition;
};

interface IResizingAnchorProps {
	isVisible: boolean;
	position: AnchorPosition;
	onMouseDown: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		pos: AnchorPosition
	) => void;
}

const ResizingAnchor: React.FC<IResizingAnchorProps> = (props) => {
	const { position, isVisible, onMouseDown } = props;

	return (
		<Box
			draggable={false}
			onMouseDown={(e) => {
				onMouseDown(e, position);
			}}
			sx={{
				display: isVisible ? 'initial' : 'none',
				width: '15px',
				height: '15px',
				position: 'absolute',
				cursor: 'move',
				backgroundColor: 'white',
				outline: '1px solid black',
				top: position.vertical === 'top' ? '-7.5px' : undefined,
				left: position.horizontal === 'left' ? '-7.5px' : undefined,
				right: position.horizontal === 'right' ? '-7.5px' : undefined,
				bottom: position.vertical === 'bottom' ? '-7.5px' : undefined,
			}}
			onClick={(e) => e.stopPropagation()}
		/>
	);
};

export default ResizingAnchor;
