import React, { useState, useEffect } from 'react';
import { Dimensions, TextElement } from '../../../shared/types/presentation';
import { Text } from '../../../smpUI/components';
import { ITextProps } from '../../../smpUI/components/Text';
import SlideTextEditingTextarea from '../slideEditing/SlideTextEditingTextarea';

interface ISlideTextElementProps extends ITextProps {
	textElement: TextElement;
	parentSize: Dimensions;
	editable: boolean;
}

const SlideTextElement: React.FC<ISlideTextElementProps> = (props) => {
	const { textElement, parentSize, editable } = props;
	const [heightMultiplier, setHeightMultiplier] = useState<number>(
		parentSize.height / textElement.position.rel.height
	);
	const [widthMultiplier, setWidthMultiplier] = useState<number>(
		parentSize.width / textElement.position.rel.width
	);

	const style: React.CSSProperties = {
		whiteSpace: 'nowrap',
		wordBreak: 'keep-all',
		color: textElement.color,
		fontFamily: textElement.font,
		fontSize: `${heightMultiplier * textElement.size}px`,
		fontWeight: textElement.bold ? 'bold' : undefined,
		fontStyle: textElement.italic ? 'italic' : 'normal',
		position: 'absolute',
		left: `${widthMultiplier * textElement.position.x}px`,
		top: `${heightMultiplier * textElement.position.y}px`,
		textAlign: textElement.alignment,
		transform: `translate(${
			textElement.alignment === 'center'
				? -50
				: textElement.alignment === 'right'
				? -100
				: 0
		}%, 0%)`,
		zIndex: 100,
		pointerEvents: editable ? 'initial' : 'none',
	};

	useEffect(() => {
		setHeightMultiplier(parentSize.height / textElement.position.rel.height);
		setWidthMultiplier(parentSize.width / textElement.position.rel.width);
	}, [
		parentSize.height,
		parentSize.width,
		textElement.position.rel.width,
		textElement.position.rel.height,
	]);

	return (
		<>
			{editable ? (
				<SlideTextEditingTextarea
					parentSize={parentSize}
					elementId={textElement.id}
					editableStyle={style}
				/>
			) : (
				<Text color={textElement.color} style={style} {...props}>
					{textElement.text}
				</Text>
			)}
		</>
	);
};

export default SlideTextElement;
