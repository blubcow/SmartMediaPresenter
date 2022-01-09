import React, {
	createContext,
	PropsWithChildren,
	useState,
	useCallback,
} from 'react';
import { SinglePresentation } from '../shared/types/presentation';

export const PresentationCacheContext = createContext({});

const PresentationCacheProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const [currentPresentaitonId, setCurrentPresentationId] = useState<
		number | undefined
	>();
	const [cachedPresentations, setCachedPresentations] = useState<
		Map<
			number,
			{
				presentation: SinglePresentation;
				imgs: HTMLImageElement[];
				loading: boolean;
				success: boolean;
				failed?: number;
			}
		>
	>(new Map());

	const cachePresentation = useCallback(
		async (id: number, presentation: SinglePresentation) => {
			setCachedPresentations(
				(curr) =>
					new Map([
						// @ts-ignore
						...curr,
						[
							id,
							{
								presentation: presentation,
								imgs: [],
								loading: true,
								success: false,
							},
						],
					])
			);

			const imgs: HTMLImageElement[] = [];
			let failed = 0;

			// TODO: count failed loads and set them in the map

			const promises = await presentation.slides.flatMap((slide) => {
				if (!slide.media) return;
				return slide.media.map((media) => {
					return new Promise((resolve, reject) => {
						if (!media.location?.local && !media.location?.remote) {
							resolve('no media src present');
							return;
						}
						const img = new Image();
						img.src = media.location.local ?? media.location.remote!;
						imgs.push(img);
						img.onload = () => {
							resolve(img);
						};
						let errCnt = 0;
						img.onerror = () => {
							errCnt++;
							if (errCnt < 2 && media.location.local && media.location.remote) {
								img.src = media.location.remote;
							} else {
								failed++;
								resolve(img);
							}
							return;
						};
					});
				});
			});

			await Promise.all(promises);

			// @ts-ignore
			const newCachedPresentations = new Map([...cachedPresentations]);
			newCachedPresentations.set(id, {
				presentation: presentation,
				imgs: imgs,
				loading: false,
				success: true,
				failed: failed > 0 ? failed : undefined,
			});
			// @ts-ignore
			setCachedPresentations(newCachedPresentations);
		},
		[]
	);

	const changeCurrentPresentation = (
		id?: number,
		presentation?: SinglePresentation
	) => {
		setCurrentPresentationId(id);
		if (id === undefined || presentation === undefined) return;

		if (!cachedPresentations.get(id)) {
			cachePresentation(id, presentation);
		}
	};

	return (
		<PresentationCacheContext.Provider
			value={{
				currentPresentationId: currentPresentaitonId,
				cachedPresentations: cachedPresentations,
				changeCurrentPresentation: changeCurrentPresentation,
			}}
		>
			{children}
		</PresentationCacheContext.Provider>
	);
};

export default PresentationCacheProvider;