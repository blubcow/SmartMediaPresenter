import { SinglePresentation } from '../shared/types/presentation';
import { PresentationEditingActionIdentifiers as ActionIdentifiers } from '../types/identifiers';
import {
	PresentationEditingAction,
	PresentationEditingSettings,
} from '../types/state';
import _ from 'lodash';

const presentationEditingReducer = (
	state: PresentationEditingSettings,
	action: PresentationEditingAction
): PresentationEditingSettings => {
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

export const getInitialState = (
	presentationId: number,
	presentation: SinglePresentation
): PresentationEditingSettings => {
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

export default presentationEditingReducer;
