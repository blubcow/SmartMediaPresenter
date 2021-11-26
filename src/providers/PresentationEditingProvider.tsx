import React, { PropsWithChildren, createContext, useReducer } from 'react';
import presentationEditingReducer, {
	getInitialState,
} from '../reducers/PresentationEditingReducer';
import { SinglePresentation } from '../shared/types/presentation';

export const PresentationEditingContext = createContext(undefined);

interface IPresentationEditingProviderProps {
	initialPresentation: SinglePresentation;
}

const PresentationEditingProvider: React.FC<
	PropsWithChildren<IPresentationEditingProviderProps>
> = ({ initialPresentation, children }) => {
	const [state, dispatch] = useReducer(
		presentationEditingReducer,
		getInitialState(initialPresentation)
	);

	return (
		<PresentationEditingContext.Provider value={undefined}>
			{children}
		</PresentationEditingContext.Provider>
	);
};

export default PresentationEditingProvider;
