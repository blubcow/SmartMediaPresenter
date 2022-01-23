import React, {
	createContext,
	PropsWithChildren,
	useState,
	useCallback,
	useEffect,
} from 'react';
import useRemoteUserContext from '../hooks/useRemoteUserContext';
import { SinglePresentation } from '../shared/types/presentation';

export const PresentationCacheContext = createContext({});

const PresentationCacheProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const { remoteUser } = useRemoteUserContext();
	const [currentPresentaitonId, setCurrentPresentationId] = useState<
		number | undefined
	>();
	const [currentRemotePresentationId, setCurrentRemotePresentationId] =
		useState<string | undefined>();
	const [cachedPresentations, setCachedPresentations] = useState<
		Map<
			number | string,
			{
				presentation: SinglePresentation;
				imgs: HTMLImageElement[];
				loading: boolean;
				success: boolean;
				failed?: number;
			}
		>
	>(new Map());

	useEffect(() => {
		setCurrentPresentationId(undefined);
		setCachedPresentations(new Map([]));
	}, [remoteUser]);

	const cachePresentation = useCallback(
		async (
			presentation: SinglePresentation,
			presentationId?: number,
			remoteId?: string
		) => {
			const id = presentationId ?? remoteId;

			if (id === undefined) return;

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

			if (presentation.slides === undefined) return;

			const promises = await presentation.slides.flatMap((slide) => {
				if (!slide.media) return;
				return slide.media.map((media) => {
					return new Promise((resolve) => {
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
		remoteId?: string,
		presentation?: SinglePresentation
	) => {
		setCurrentPresentationId(id);
		setCurrentRemotePresentationId(remoteId);
		if (
			(id === undefined && remoteId === undefined) ||
			presentation === undefined
		)
			return;

		if (!cachedPresentations.get(id ?? remoteId!)) {
			cachePresentation(presentation, id, remoteId);
		}
	};

	return (
		<PresentationCacheContext.Provider
			value={{
				currentPresentationId: currentPresentaitonId,
				currentRemotePresentationId: currentRemotePresentationId,
				cachedPresentations: cachedPresentations,
				changeCurrentPresentation: changeCurrentPresentation,
			}}
		>
			{children}
		</PresentationCacheContext.Provider>
	);
};

export default PresentationCacheProvider;
