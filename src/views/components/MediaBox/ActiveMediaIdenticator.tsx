import React, { useState, useEffect } from 'react';
import { MediaRessource } from '../../../shared/types/presentation';
import { Box } from '../../../smpUI/components';
import { useActiveMediaIndicatorStyles } from './styles';

interface IActiveMediaIdenticatorProps {
	image: HTMLImageElement;
	mediaElement: MediaRessource;
}

const ActiveMediaIdenticator: React.FC<IActiveMediaIdenticatorProps> = (
	props
) => {
	const { image, mediaElement } = props;
	const { indicator } = useActiveMediaIndicatorStyles();

	return (
		<Box
			className={indicator}
			style={{
				top:
					image.offsetTop +
					(mediaElement.settings?.translation?.y ?? 0) +
					image.height * ((mediaElement.settings?.crop?.y ?? 0) / 100) +
					'px',
				left:
					image.offsetLeft +
					(mediaElement.settings?.translation?.x ?? 0) +
					image.width * ((mediaElement.settings?.crop?.x ?? 0) / 100) +
					'px',
				height:
					image.height * ((mediaElement.settings?.crop?.height ?? 100) / 100) +
					'px',
				width:
					image.width * ((mediaElement.settings?.crop?.width ?? 100) / 100) +
					'px',
				transform: `scale(${mediaElement.settings?.scaling?.x ?? 1}, ${
					mediaElement.settings?.scaling?.y ?? 1
				})`,
			}}
			sx={{ outlineColor: 'primary.main' }}
		/>
	);
};

export default ActiveMediaIdenticator;
