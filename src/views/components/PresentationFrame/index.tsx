import React, { useState, useEffect } from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
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
}

const PresentationFrame: React.FC<IPresentationFrameProps> = (props) => {
	const {
		isEditing,
		isHidden = false,
		parentSize,
		settings,
		outlineColor,
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
	const { dispatch } = usePresentationEditingContext();

	useEffect(() => {
		setEditingSettings(settings);
		setCurrentSettings(settings);
	}, [settings]);

	useEffect(() => {
		setHeightMultiplier(parentSize.height / (settings?.rel.height ?? 1));
		setWidthMultiplier(parentSize.width / (settings?.rel.width ?? 1));
	}, [parentSize, settings?.rel]);

	useEffect(() => {
		setEditingSettings({
			rel: { ...parentSize },
			top: heightMultiplier * (settings?.top ?? 0),
			left: widthMultiplier * (settings?.left ?? 0),
			right: widthMultiplier * (settings?.right ?? 0),
			bottom: heightMultiplier * (settings?.bottom ?? 0),
		});
		setCurrentSettings({ ...editingSettings! });
	}, [isEditing, heightMultiplier, widthMultiplier, parentSize]);

	useEffect(() => {
		if (!activePosition) return;
		const handleMove = (e: MouseEvent) => {
			if (activePosition)
				onDrag(initialPosition.x - e.pageX, initialPosition.y - e.pageY);
		};
		const handleUp = () => {
			setActivePosition(undefined);
			setCurrentSettings(editingSettings ? { ...editingSettings } : undefined);
			if (editingSettings)
				dispatch({
					type: PresentationEditingActionIdentifiers.presentationFrameUpdated,
					payload: { presentationFrameUpdatedSettings: editingSettings },
				});
		};
		document.addEventListener('mousemove', handleMove);
		document.addEventListener('mouseup', handleUp);

		return () => {
			document.removeEventListener('mousemove', handleMove);
			document.removeEventListener('mouseup', handleUp);
		};
	}, [activePosition, initialPosition, dispatch, editingSettings]);

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
				top: `${
					isEditing
						? editingSettings?.top ?? 0
						: heightMultiplier * (settings?.top ?? 0)
				}px`,
				left: `${
					isEditing
						? editingSettings?.left ?? 0
						: widthMultiplier * (settings?.left ?? 0)
				}px`,
				right: `${
					isEditing
						? editingSettings?.right ?? 0
						: widthMultiplier * (settings?.right ?? 0)
				}px`,
				bottom: `${
					isEditing
						? editingSettings?.bottom ?? 0
						: heightMultiplier * (settings?.bottom ?? 0)
				}px`,
			}}
			onClick={(e) => e.stopPropagation()}
		>
			<Box
				sx={{
					bgcolor: 'transparent',
					height: '100%',
					width: '100%',
					pointerEvents: isEditing ? 'initial' : 'none',
					position: 'relative',
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
