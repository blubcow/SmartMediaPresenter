import React, { PropsWithChildren, createContext, useReducer } from 'react';
import presentationEditingReducer, {
	getInitialState,
} from '../reducers/PresentationEditingReducer';
import {
	getEmptySlide,
	SinglePresentation,
} from '../shared/types/presentation';

export const PresentationEditingContext = createContext({});

interface IPresentationEditingProviderProps {
	initialPresentation: SinglePresentation;
}

const PresentationEditingProvider: React.FC<
	PropsWithChildren<IPresentationEditingProviderProps>
> = ({ initialPresentation, children }) => {
	if (!initialPresentation.slides.length)
		initialPresentation.slides = [getEmptySlide(0)];
	const [state, dispatch] = useReducer(
		presentationEditingReducer,
		getInitialState(initialPresentation)
	);

	return (
		<PresentationEditingContext.Provider value={{ state, dispatch }}>
			{children}
		</PresentationEditingContext.Provider>
	);
};

export default PresentationEditingProvider;
