import {
	Dimensions,
	PresentationFrameSettings,
	SinglePresentation,
	Slide,
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
	activeComponent?: number;
	lastFont?: string;
	editingBoxDimensions: Dimensions;
	presentationFrameUpdatedSettings?: PresentationFrameSettings;
	presentation: SinglePresentation;
	initialPresentation: SinglePresentation;
	unsavedChanges: boolean;
	presentationId: number;
	initialSlides: Slide[];
}

export interface PresentationEditingAction {
	type: PresentationEditingActionIdentifiers;
	payload?: Partial<PresentationEditingSettings>;
}
