import { useContext } from 'react';
import { PresentationCacheContext } from '../providers/PresentationCacheProvider';
import { SinglePresentation } from '../shared/types/presentation';

const usePresentationCacheContext = () => {
	const context = useContext(PresentationCacheContext) as {
		currentPresentationId: number | undefined;
		cachedPresentations: Map<
			number,
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
			presentation?: SinglePresentation
		) => void;
	};

	if (context === undefined)
		throw new Error(
			'usePresentationCacheContext has to be called inside of a PresentationCacheProvider!'
		);

	return { ...context };
};

export default usePresentationCacheContext;
