import { useContext } from 'react';
import { PresentationEditingContext } from '../providers/PresentationEditingProvider';

const usePresentationEditingContext = () => {
	const context = useContext(PresentationEditingContext);
	if (!context)
		throw new Error(
			'usePresentationEditing hook has to be called inside of an PresentationEditingProvider!'
		);

	return context;
};

export default usePresentationEditingContext;
