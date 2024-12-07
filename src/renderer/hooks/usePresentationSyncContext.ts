import { useContext } from 'react';
import { PresentationSyncContext } from '../providers';
import { IPresentationSyncContext } from '../shared/presentaitonSycncing.interface';

export const usePresentationSyncContext = () => {
	const context = useContext(
		PresentationSyncContext
	) as IPresentationSyncContext;
	if (context === undefined)
		throw new Error(
			'usePresentationSyncContext has to be called inside of a PresentationSyncProvider!'
		);

	return { ...context };
};
