import { SinglePresentation } from '../shared/types/presentation';
import { PresentationEditingActionIdentifiers as ActionIdentifiers } from '../types/identifiers';
import {
	PresentationEditingAction,
	PresentationEditingSettings,
} from '../types/state';
import * as lodash from 'lodash';

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
			};
		case ActionIdentifiers.editingSlideStated:
			return {
				...state,
				editingControls: 'slide',
				activeMedia: undefined,
			};
		case ActionIdentifiers.editingPresentationFrameStarted:
			return {
				...state,
				editingControls: 'presentationFrame',
				activeMedia: undefined,
			};
		case ActionIdentifiers.editingTextStarted:
			return {
				...state,
				editingControls: 'text',
				activeMedia: undefined,
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
				unsavedChanges: lodash.isEqual(
					action.payload?.presentation ?? state.presentation,
					state.initialPresentation
				),
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
				initialPresentation: state.presentation,
				unsavedChanges: false,
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
		presentation: presentation,
		initialPresentation: presentation,
		unsavedChanges: false,
		presentationId: presentationId,
	};
};

export default presentationEditingReducer;
