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
	activeMedia?: number; // selected media to edit
	activeComponent?: number;
	lastFont?: string;
	editingBoxDimensions: Dimensions;
	presentationFrameUpdatedSettings?: PresentationFrameSettings;
	presentation: SinglePresentation;
	initialPresentation: SinglePresentation;
	unsavedChanges: boolean;
	presentationId: number;
	initialSlides: Slide[];

	waitForSecondActiveMedia: boolean;
	secondActiveMedia?: number; // second selected media (eg. for color transfer)
}

export interface PresentationEditingAction {
	type: PresentationEditingActionIdentifiers;
	payload?: Partial<PresentationEditingSettings>;
}
