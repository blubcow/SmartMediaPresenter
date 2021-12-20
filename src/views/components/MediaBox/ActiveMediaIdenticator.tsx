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
	const [hidden, setHidden] = useState<boolean>(false);

	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === ' ') setHidden(true);
		};
		const handleKeyup = (e: KeyboardEvent) => {
			if (e.key === ' ') setHidden(false);
		};

		window.addEventListener('keydown', handleKeydown);

		window.addEventListener('keyup', handleKeyup);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyup);
		};
	}, []);

	return (
		<Box
			className={indicator}
			style={{
				display: hidden ? 'none' : undefined,
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
					image.clientWidth *
						((mediaElement.settings?.crop?.width ?? 100) / 100) +
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
