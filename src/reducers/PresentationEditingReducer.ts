import { SinglePresentation } from '../shared/types/presentation';

export enum ActionIdentifier {
	editingMediaStarted = 'ems',
	editingSlideStated = 'ess',
	editingPresentationFrameStarted = 'epfs',
	editingTextStarted = 'ets',
}

export interface Action {
	type: ActionIdentifier;
	settings?: Partial<PresentationEditingSettings>;
}

export type EditingControls = 'slide' | 'media' | 'presentationFrame' | 'text';

export interface PresentationEditingSettings {
	editingControls: EditingControls;
	presentation: SinglePresentation;
	initialPresentation: SinglePresentation;
}

const presentationEditingReducer = (
	state: PresentationEditingSettings,
	action: Action
): PresentationEditingSettings => {
	switch (action.type) {
		case ActionIdentifier.editingMediaStarted:
			return { ...state, editingControls: 'media' };
		case ActionIdentifier.editingSlideStated:
			return { ...state, editingControls: 'slide' };
		case ActionIdentifier.editingPresentationFrameStarted:
			return { ...state, editingControls: 'presentationFrame' };
		case ActionIdentifier.editingTextStarted:
			return { ...state, editingControls: 'text' };
		default:
			return state;
	}
};

export const getInitialState = (
	presentation: SinglePresentation
): PresentationEditingSettings => {
	return {
		editingControls: 'slide',
		presentation: presentation,
		initialPresentation: presentation,
	};
};

export default presentationEditingReducer;
