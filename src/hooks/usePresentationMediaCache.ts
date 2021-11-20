import { useEffect, useState } from 'react';
import { SinglePresentation } from '../shared/types/presentation';

const usePresentationMediaCache = (presentation?: SinglePresentation) => {
	const [pres, setPresentation] = useState<SinglePresentation | undefined>(
		presentation
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [imgs, setImgs] = useState<HTMLImageElement[]>([]);

	useEffect(() => {
		cacheMedia();
	}, [pres]);

	const cacheMedia = async () => {
		setIsLoading(true);

		if (!pres) return;

		const promises = await pres.slides.flatMap((slide) => {
			if (!slide.media) return;
			return slide.media.map((media) => {
				return new Promise((resolve, reject) => {
					if (!media.location.local && !media.location.remote)
						resolve('no media src present');
					const img = new Image();
					img.src = media.location.local ?? media.location.remote!;
					setImgs((curr) => [...curr, img]);
					img.onload = () => {
						resolve('loaded media');
					};
					img.onerror = () => reject('img loading failed');
				});
			});
		});

		await Promise.all(promises);

		setIsLoading(false);
	};

	return { isLoading, setPresentation };
};

export default usePresentationMediaCache;
