import { useContext } from 'react';
import { PresentationCacheContext } from '../providers/PresentationCacheProvider';
import { SinglePresentation } from '../shared/types/presentation';

const usePresentationCacheContext = () => {
	const context = useContext(PresentationCacheContext) as {
		currentPresentationId: number | undefined;
		currentRemotePresentationId: string | undefined;
		cachedPresentations: Map<
			number | string,
			{
				presentation: SinglePresentation;
				imgs: HTMLImageElement[];
				loading: boolean;
				success: boolean;
				failed?: number | undefined;
			}
		>;
		changeCurrentPresentation: (
			id?: number,
			remoteId?: string,
			presentation?: SinglePresentation
		) => void;
		updatePresentation: (id: number | string, pres: SinglePresentation) => void;
		unselectLocalPresentation: () => void;
		unselectRemotePresentation: () => void;
		selectLocalPresentation: (id: number) => void;
		selectRemotePresentation: (id: string) => void;
	};

	if (context === undefined)
		throw new Error(
			'usePresentationCacheContext has to be called inside of a PresentationCacheProvider!'
		);

	return { ...context };
};

export default usePresentationCacheContext;
