import {
	Dimensions,
	PresentationFrameSettings,
	SinglePresentation,
} from '../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from './identifiers';

export type PresentationEditingControls =
	| 'slide'
	| 'media'
	| 'presentationFrame'
	| 'text';

export interface PresentationEditingSettings {
	editingControls: PresentationEditingControls;
	currentSlide: number;
	activeMedia?: number;
	editingBoxDimensions: Dimensions;
	presentationFrameUpdatedSettings?: PresentationFrameSettings;
	presentation: SinglePresentation;
	initialPresentation: SinglePresentation;
	presentationId: number;
}

export interface PresentationEditingAction {
	type: PresentationEditingActionIdentifiers;
	payload?: Partial<PresentationEditingSettings>;
}
