import React, { useState, useEffect } from 'react';
import {
	Dimensions,
	PresentationFrameSettings,
} from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';

interface IPresentationFrameProps {
	isEditing: boolean;
	parentSize: Dimensions;
	settings?: PresentationFrameSettings;
	outlineColor: string;
	onSizeChanged?: (size: Dimensions) => void;
}

const PresentationFrame: React.FC<IPresentationFrameProps> = (props) => {
	const { isEditing, parentSize, settings, outlineColor, onSizeChanged } =
		props;
	const [heightMultiplier, setHeightMultiplier] = useState<number>(
		parentSize.height / (settings?.rel.height ?? 1)
	);
	const [widthMultiplier, setWidthMultiplier] = useState<number>(
		parentSize.width / (settings?.rel.width ?? 1)
	);

	useEffect(() => {
		setHeightMultiplier(parentSize.height / (settings?.rel.height ?? 1));
		setWidthMultiplier(parentSize.width / (settings?.rel.width ?? 1));
	}, [parentSize, settings?.rel]);

	return (
		<Box
			sx={{
				position: 'absolute',
				zIndex: 10,
				outlineStyle: 'solid',
				outlineWidth: isEditing ? '4px' : `${parentSize.width ?? 0}px`,
				outlineColor: isEditing ? 'yellow' : outlineColor,
				pointerEvents: isEditing ? 'initial' : 'none',
				cursor: 'grab',
				top: `${heightMultiplier * (settings?.top ?? 0)}px`,
				left: `${widthMultiplier * (settings?.left ?? 0)}px`,
				height: `${heightMultiplier * (settings?.size.height ?? 1)}px`,
				width: `${widthMultiplier * (settings?.size.width ?? 1)}px`,
			}}
		/>
	);
};

export default PresentationFrame;
