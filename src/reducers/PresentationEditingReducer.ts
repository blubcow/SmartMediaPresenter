import {
	Dimensions,
	PresentationFrameSettings,
	SinglePresentation,
} from '../shared/types/presentation';

export enum ActionIdentifier {
	editingMediaStarted = 'ems',
	editingSlideStated = 'ess',
	editingPresentationFrameStarted = 'epfs',
	editingTextStarted = 'ets',
	changeCurrentSlide = 'ccs',
	presentationSettingsUpdated = 'psu',
	editingBoxDimensionsUpdated = 'ebdu',
	presentationFrameUpdated = 'pfu',
}

export interface Action {
	type: ActionIdentifier;
	payload?: Partial<PresentationEditingSettings>;
}

export type EditingControls = 'slide' | 'media' | 'presentationFrame' | 'text';

export interface PresentationEditingSettings {
	editingControls: EditingControls;
	currentSlide: number;
	activeMedia?: number;
	editingBoxDimensions: Dimensions;
	presentationFrameUpdatedSettings?: PresentationFrameSettings;
	presentation: SinglePresentation;
	initialPresentation: SinglePresentation;
}

const presentationEditingReducer = (
	state: PresentationEditingSettings,
	action: Action
): PresentationEditingSettings => {
	switch (action.type) {
		case ActionIdentifier.editingMediaStarted:
			return {
				...state,
				editingControls: 'media',
				activeMedia: action.payload?.activeMedia ?? state.activeMedia,
			};
		case ActionIdentifier.editingSlideStated:
			return {
				...state,
				editingControls: 'slide',
				activeMedia: undefined,
			};
		case ActionIdentifier.editingPresentationFrameStarted:
			return {
				...state,
				editingControls: 'presentationFrame',
				activeMedia: undefined,
			};
		case ActionIdentifier.editingTextStarted:
			return {
				...state,
				editingControls: 'text',
				activeMedia: undefined,
			};
		case ActionIdentifier.changeCurrentSlide:
			return {
				...state,
				currentSlide: action.payload?.currentSlide ?? state.currentSlide,
			};
		case ActionIdentifier.presentationSettingsUpdated:
			return {
				...state,
				presentation: action.payload?.presentation ?? state.presentation,
			};
		case ActionIdentifier.editingBoxDimensionsUpdated:
			return {
				...state,
				editingBoxDimensions:
					action.payload?.editingBoxDimensions ?? state.editingBoxDimensions,
			};
		case ActionIdentifier.presentationFrameUpdated:
			return {
				...state,
				presentationFrameUpdatedSettings:
					action.payload?.presentationFrameUpdatedSettings,
			};
		default:
			return state;
	}
};

export const getInitialState = (
	presentation: SinglePresentation
): PresentationEditingSettings => {
	return {
		editingControls: 'slide',
		currentSlide: 0,
		editingBoxDimensions: { height: 0, width: 0 },
		presentation: presentation,
		initialPresentation: presentation,
	};
};

export default presentationEditingReducer;
