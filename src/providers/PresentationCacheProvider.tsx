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

interface PresentationCacheValue {
	presentation: SinglePresentation;
	imgs: HTMLImageElement[];
	loading: boolean;
	success: boolean;
	failed?: number;
}

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
		Map<number | string, PresentationCacheValue>
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
		[cachedPresentations]
	);

	const updatePresentation = (id: number, pres: SinglePresentation) => {
		if (cachedPresentations.get(id) === undefined) return;

		const newCache: Map<
			number | string,
			PresentationCacheValue
			// @ts-ignore
		> = new Map([...cachedPresentations]);

		newCache.set(id, { ...cachedPresentations.get(id)!, presentation: pres });
		setCachedPresentations(newCache);
	};

	const unselectLocalPresentation = () => {
		if (currentPresentaitonId === undefined) return;

		const val = cachedPresentations.get(currentPresentaitonId);

		const newCache: Map<number | string, PresentationCacheValue> = new Map([
			// @ts-ignore
			...cachedPresentations,
		]);
		newCache.delete(currentPresentaitonId);
		if (currentRemotePresentationId !== undefined && val)
			newCache.set(currentRemotePresentationId, val);
		setCachedPresentations(newCache);

		setCurrentPresentationId(undefined);
	};

	const selectLocalPresentation = (id: number) => {
		setCurrentPresentationId(id);

		if (currentRemotePresentationId !== undefined) {
			const val = cachedPresentations.get(currentRemotePresentationId);
			if (val) {
				const newCache: Map<number | string, PresentationCacheValue> = new Map([
					// @ts-ignore
					...cachedPresentations,
				]);
				newCache.delete(currentRemotePresentationId);
				newCache.set(id, val);
				setCachedPresentations(newCache);
			}
		}
	};

	const unselectRemotePresentation = () => {
		if (currentRemotePresentationId === undefined) return;

		const val = cachedPresentations.get(currentRemotePresentationId);
		const newCache: Map<number | string, PresentationCacheValue> = new Map([
			// @ts-ignore
			...cachedPresentations,
		]);
		newCache.delete(currentRemotePresentationId);
		if (currentPresentaitonId !== undefined && val)
			newCache.set(currentRemotePresentationId, val);
		setCachedPresentations(newCache);

		setCurrentRemotePresentationId(undefined);
	};

	const selectRemotePresentation = (id: string) => {
		setCurrentRemotePresentationId(id);
	};

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
				updatePresentation: updatePresentation,
				unselectLocalPresentation: unselectLocalPresentation,
				unselectRemotePresentation: unselectRemotePresentation,
				selectLocalPresentation: selectLocalPresentation,
				selectRemotePresentation: selectRemotePresentation,
			}}
		>
			{children}
		</PresentationCacheContext.Provider>
	);
};

export default PresentationCacheProvider;
