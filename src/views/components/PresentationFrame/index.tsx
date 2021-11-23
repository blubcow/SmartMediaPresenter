import React, { useState, useEffect } from 'react';
import {
	Dimensions,
	PresentationFrameSettings,
} from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import ResizingAnchor, { AnchorPosition } from './ResizingAnchor';

interface IPresentationFrameProps {
	isEditing: boolean;
	isHidden?: boolean;
	parentSize: Dimensions;
	settings?: PresentationFrameSettings;
	outlineColor: string;
	onPresentationFrameChanged?: (
		presentationFrame: PresentationFrameSettings
	) => void;
}

const PresentationFrame: React.FC<IPresentationFrameProps> = (props) => {
	const {
		isEditing,
		isHidden = false,
		parentSize,
		settings,
		outlineColor,
		onPresentationFrameChanged,
	} = props;
	const [heightMultiplier, setHeightMultiplier] = useState<number>(
		parentSize.height / (settings?.rel.height ?? 1)
	);
	const [widthMultiplier, setWidthMultiplier] = useState<number>(
		parentSize.width / (settings?.rel.width ?? 1)
	);
	const [currentSettings, setCurrentSettings] = useState<
		PresentationFrameSettings | undefined
	>(settings);
	const [editingSettings, setEditingSettings] = useState<
		PresentationFrameSettings | undefined
	>(settings);
	const [initialPosition, setInitialPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });
	const [activePosition, setActivePosition] = useState<
		AnchorPosition | undefined
	>();

	useEffect(() => {
		setEditingSettings(settings);
		setCurrentSettings(settings);
	}, [settings]);

	useEffect(() => {
		setHeightMultiplier(parentSize.height / (editingSettings?.rel.height ?? 1));
		setWidthMultiplier(parentSize.width / (editingSettings?.rel.width ?? 1));
	}, [parentSize, editingSettings?.rel]);

	const onDrag = (x: number, y: number) => {
		if (!activePosition) return;
		const newSettings: PresentationFrameSettings = {
			rel: { height: parentSize.height, width: parentSize.width },
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			...currentSettings,
		};
		newSettings.top =
			activePosition.vertical === 'top'
				? Math.max(0, newSettings.top - y)
				: newSettings.top;
		newSettings.left =
			activePosition.horizontal === 'left'
				? Math.max(0, newSettings.left - x)
				: newSettings.left;
		newSettings.right =
			activePosition.horizontal === 'right'
				? Math.max(0, newSettings.right + x)
				: newSettings.right;
		newSettings.bottom =
			activePosition.vertical === 'bottom'
				? Math.max(0, newSettings.bottom + y)
				: newSettings.bottom;

		setEditingSettings({ ...newSettings });
	};

	return (
		<Box
			sx={{
				position: 'absolute',
				zIndex: 10,
				outlineStyle: 'solid',
				outlineWidth: isHidden
					? '0px'
					: isEditing
					? '4px'
					: `${parentSize.width ?? 0}px`,
				outlineColor: isEditing ? 'yellow' : outlineColor,
				pointerEvents: isEditing ? 'initial' : 'none',
				cursor: 'grab',
				top: `${heightMultiplier * (editingSettings?.top ?? 0)}px`,
				left: `${widthMultiplier * (editingSettings?.left ?? 0)}px`,
				right: `${widthMultiplier * (editingSettings?.right ?? 0)}px`,
				bottom: `${heightMultiplier * (editingSettings?.bottom ?? 0)}px`,
			}}
		>
			<Box
				sx={{
					bgcolor: 'transparent',
					height: '100%',
					width: '100%',
					pointerEvents: isEditing ? 'initial' : 'none',
					position: 'relative',
				}}
				onMouseUp={() => {
					setActivePosition(undefined);
					setCurrentSettings(
						editingSettings ? { ...editingSettings } : undefined
					);
					if (onPresentationFrameChanged && editingSettings)
						onPresentationFrameChanged(editingSettings);
				}}
				onMouseLeave={() => {
					setActivePosition(undefined);
					setCurrentSettings(
						editingSettings ? { ...editingSettings } : undefined
					);
					if (onPresentationFrameChanged && editingSettings)
						onPresentationFrameChanged(editingSettings);
				}}
				onMouseMove={(e) => {
					if (activePosition)
						onDrag(initialPosition.x - e.pageX, initialPosition.y - e.pageY);
				}}
			>
				<ResizingAnchor
					position={{ vertical: 'top', horizontal: 'left' }}
					isVisible={isEditing}
					onMouseDown={(e, pos) => {
						setActivePosition(pos);
						setInitialPosition({ x: e.pageX, y: e.pageY });
					}}
				/>
				<ResizingAnchor
					position={{ vertical: 'top', horizontal: 'right' }}
					isVisible={isEditing}
					onMouseDown={(e, pos) => {
						setActivePosition(pos);
						setInitialPosition({ x: e.pageX, y: e.pageY });
					}}
				/>
				<ResizingAnchor
					position={{ vertical: 'bottom', horizontal: 'left' }}
					isVisible={isEditing}
					onMouseDown={(e, pos) => {
						setActivePosition(pos);
						setInitialPosition({ x: e.pageX, y: e.pageY });
					}}
				/>
				<ResizingAnchor
					position={{ vertical: 'bottom', horizontal: 'right' }}
					isVisible={isEditing}
					onMouseDown={(e, pos) => {
						setActivePosition(pos);
						setInitialPosition({ x: e.pageX, y: e.pageY });
					}}
				/>
			</Box>
		</Box>
	);
};

export default PresentationFrame;
