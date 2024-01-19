import { useContext } from 'react';
import { PresentationSyncContext } from '../providers/PresentationSyncProvider';
import { IPresentationSyncContext } from '../types/presentaitonSycncing';

const usePresentationSyncContext = () => {
	const context = useContext(
		PresentationSyncContext
	) as IPresentationSyncContext;
	if (context === undefined)
		throw new Error(
			'usePresentationSyncContext has to be called inside of a PresentationSyncProvider!'
		);

	return { ...context };
};

export default usePresentationSyncContext;
