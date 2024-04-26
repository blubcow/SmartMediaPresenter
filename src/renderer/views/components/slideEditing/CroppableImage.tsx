import React, { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import { MediaCrop, MediaRessource } from '../../../shared/types/presentation';

interface ICroppableImageProps {
	onCropChanged: (crop: MediaCrop) => void;
	mediaElement: MediaRessource;
}

const CroppableImage: React.FC<ICroppableImageProps> = (props) => {
	const { onCropChanged, mediaElement } = props;
	const [crop, setCrop] = useState<Crop>({
		x: mediaElement.settings?.crop?.x ?? 0,
		y: mediaElement.settings?.crop?.y ?? 0,
		width: mediaElement.settings?.crop?.width ?? 0,
		height: mediaElement.settings?.crop?.height ?? 0,
		unit: '%',
	});

	return (
		<ReactCrop
			crop={crop}
			onChange={(_, crop) => {
				onCropChanged({
					x: crop.x,
					y: crop.y,
					width: crop.width,
					height: crop.height,
				});
				setCrop(crop);
			}}
		>
			<img src={mediaElement.location.local ?? mediaElement.location.remote ?? ''}/>
		</ReactCrop>
	);
};

export default CroppableImage;
