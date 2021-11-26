import { SinglePresentation } from '../shared/types/presentation';

enum ActionIdentifier {
	editingMediaStarted = 'ems',
	editingMediaEnded = 'eme',
}

interface Action {
	type: ActionIdentifier;
	settings?: Partial<PresentationEditingSettings>;
}

interface PresentationEditingSettings {
	isEditingMedia: boolean;
	presentation: SinglePresentation;
	initialPresentation: SinglePresentation;
}

const presentationEditingReducer = (
	state: PresentationEditingSettings,
	action: Action
) => {
	switch (action.type) {
		case ActionIdentifier.editingMediaStarted:
			return { ...state, isEditingMedia: true };
		case ActionIdentifier.editingMediaEnded:
			return { ...state, isEditingMedia: false };
		default:
			return state;
	}
};

export const getInitialState = (
	presentation: SinglePresentation
): PresentationEditingSettings => {
	return {
		isEditingMedia: false,
		presentation: presentation,
		initialPresentation: presentation,
	};
};

export default presentationEditingReducer;
