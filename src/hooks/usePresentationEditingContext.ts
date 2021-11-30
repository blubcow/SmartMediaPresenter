import { useContext, Dispatch } from 'react';
import { PresentationEditingContext } from '../providers/PresentationEditingProvider';
import { MediaRessource } from '../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../types/identifiers';
import {
	PresentationEditingSettings,
	PresentationEditingAction,
} from '../types/state';

const usePresentationEditingContext = () => {
	const context = useContext(PresentationEditingContext) as {
		state: PresentationEditingSettings;
		dispatch: Dispatch<PresentationEditingAction>;
	};
	if (!context)
		throw new Error(
			'usePresentationEditing hook has to be called inside of an PresentationEditingProvider!'
		);

	const dispatchMediaTranslationTransformation = (x: number, y: number) => {
		if (context.state.activeMedia === undefined)
			throw new Error(
				'tried to translate a media object without a media object being active!'
			);

		const mediaResource: MediaRessource =
			context.state.presentation.slides[context.state.currentSlide].media[
				context.state.activeMedia
			];
		const heightDivider =
			context.state.editingBoxDimensions.height /
			(mediaResource.settings?.translation?.rel.height ??
				context.state.editingBoxDimensions.height);
		const widthDivider =
			context.state.editingBoxDimensions.width /
			(mediaResource.settings?.translation?.rel.width ??
				context.state.editingBoxDimensions.width);
		const prevTransformation = {
			x: (mediaResource?.settings?.translation?.x ?? 0) * widthDivider,
			y: (mediaResource?.settings?.translation?.y ?? 0) * heightDivider,
		};
		const currentTransformation = {
			x: x,
			y: y,
		};

		const mediaSettings = { ...mediaResource.settings };
		mediaSettings.translation = {
			rel: { ...context.state.editingBoxDimensions },
			x: (prevTransformation.x ?? 0) + currentTransformation.x,
			y: (prevTransformation.y ?? 0) - currentTransformation.y,
		};
		const newPresentation = { ...context.state.presentation };
		newPresentation.slides[context.state.currentSlide].media[
			context.state.activeMedia
		].settings = mediaSettings;
		context.dispatch({
			type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
			payload: { presentation: newPresentation },
		});
	};

	return { ...context, dispatchMediaTranslationTransformation };
};

export default usePresentationEditingContext;
