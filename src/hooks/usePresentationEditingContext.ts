import { useContext, Dispatch } from 'react';
import { PresentationEditingContext } from '../providers/PresentationEditingProvider';
import {
	PresentationEditingSettings,
	Action,
} from '../reducers/PresentationEditingReducer';

const usePresentationEditingContext = () => {
	const context = useContext(PresentationEditingContext);
	if (!context)
		throw new Error(
			'usePresentationEditing hook has to be called inside of an PresentationEditingProvider!'
		);

	return context as {
		state: PresentationEditingSettings;
		dispatch: Dispatch<Action>;
	};
};

export default usePresentationEditingContext;
