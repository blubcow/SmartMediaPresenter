import { useContext, Dispatch } from 'react';
import { PresentationEditingContext } from '../providers/PresentationEditingProvider';
import {
	PresentationEditingSettings,
	PresentationEditingAction,
} from '../types/state';

const usePresentationEditingContext = () => {
	const context = useContext(PresentationEditingContext);
	if (!context)
		throw new Error(
			'usePresentationEditing hook has to be called inside of an PresentationEditingProvider!'
		);

	return context as {
		state: PresentationEditingSettings;
		dispatch: Dispatch<PresentationEditingAction>;
	};
};

export default usePresentationEditingContext;
