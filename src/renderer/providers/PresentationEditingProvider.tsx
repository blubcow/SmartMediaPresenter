import _ from 'lodash';
import React, { createContext, PropsWithChildren, useReducer } from 'react';
import { PresentationEditingActionIdentifiers as ActionIdentifiers } from '../shared/identifiers.enum';
import {
	getEmptySlide,
	SinglePresentation,
} from '../shared/presentation.interface';
import { PresentationEditingAction, PresentationEditingSettings } from '../shared/state.interface';

export const PresentationEditingContext = createContext({});

interface IPresentationEditingProviderProps {
	presentationId: number;
	initialPresentation: SinglePresentation;
}

export const PresentationEditingProvider: React.FC<
	PropsWithChildren<IPresentationEditingProviderProps>
> = ({ presentationId, initialPresentation, children }) => {
	if (!initialPresentation.slides.length)
		initialPresentation.slides = [
			getEmptySlide(0, initialPresentation.theme?.defaultFormat),
		];

	const [state, dispatch] = useReducer(
		presentationEditingReducer,
		getInitialState(presentationId, initialPresentation)
	);

	return (
		<PresentationEditingContext.Provider value={{ state, dispatch }}>
			{children}
		</PresentationEditingContext.Provider>
	);
};

function getInitialState(
	presentationId: number,
	presentation: SinglePresentation
): PresentationEditingSettings {
	return {
		editingControls: 'slide',
		currentSlide: 0,
		editingBoxDimensions: { height: 0, width: 0 },
		presentation: { ...presentation },
		initialPresentation: { ...presentation },
		unsavedChanges: false,
		presentationId: presentationId,
		initialSlides: JSON.parse(JSON.stringify(presentation.slides)),
		waitForSecondActiveMedia: false
	};
};

function presentationEditingReducer(
	state: PresentationEditingSettings,
	action: PresentationEditingAction
): PresentationEditingSettings {
	switch (action.type) {
		case ActionIdentifiers.editingMediaStarted:
			return {
				...state,
				editingControls: 'media',
				activeMedia: action.payload?.activeMedia ?? state.activeMedia,
				activeComponent: undefined,
				waitForSecondActiveMedia: false,
				secondActiveMedia: undefined
			};
		case ActionIdentifiers.selectSecondMedia:
			return {
				...state,
				editingControls: 'media',
				activeMedia: action.payload?.activeMedia ?? state.activeMedia!,
				activeComponent: undefined,
				waitForSecondActiveMedia: true,
				secondActiveMedia: action.payload?.secondActiveMedia ?? state.secondActiveMedia
			};
		case ActionIdentifiers.editingSlideStated:
			return {
				...state,
				editingControls: 'slide',
				activeMedia: undefined,
				activeComponent: undefined,
				waitForSecondActiveMedia: false,
				secondActiveMedia: undefined
			};
		case ActionIdentifiers.editingPresentationFrameStarted:
			return {
				...state,
				editingControls: 'presentationFrame',
				activeMedia: undefined,
				activeComponent: undefined,
				waitForSecondActiveMedia: false,
				secondActiveMedia: undefined
			};
		case ActionIdentifiers.editingTextStarted:
			return {
				...state,
				editingControls: 'text',
				activeMedia: undefined,
				waitForSecondActiveMedia: false,
				secondActiveMedia: undefined,
				activeComponent:
					action.payload?.activeComponent ?? state.activeComponent,
			};
		case ActionIdentifiers.changeCurrentSlide:
			return {
				...state,
				currentSlide: action.payload?.currentSlide ?? state.currentSlide,
			};
		case ActionIdentifiers.presentationSettingsUpdated:
			return {
				...state,
				presentation: action.payload?.presentation ?? state.presentation,
				unsavedChanges: !_.isEqual(
					action.payload?.presentation,
					state.initialPresentation
				),
				initialSlides: action.payload?.initialSlides ?? state.initialSlides,
			};
		case ActionIdentifiers.editingBoxDimensionsUpdated:
			return {
				...state,
				editingBoxDimensions:
					action.payload?.editingBoxDimensions ?? state.editingBoxDimensions,
			};
		case ActionIdentifiers.presentationFrameUpdated:
			return {
				...state,
				presentationFrameUpdatedSettings:
					action.payload?.presentationFrameUpdatedSettings,
			};
		case ActionIdentifiers.savePresentationChanges:
			return {
				...state,
				initialPresentation: { ...state.presentation },
				unsavedChanges: false,
			};
		case ActionIdentifiers.lastFontChanged:
			return {
				...state,
				lastFont: action.payload?.lastFont ?? state.lastFont
			};
		default:
			return state;
	}
};