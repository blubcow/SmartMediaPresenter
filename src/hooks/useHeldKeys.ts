import { useState, useEffect } from 'react';

export const useHeldKeys = () => {
	const [shift, setShift] = useState<boolean>(false);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.shiftKey) setShift(true);
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		if (!e.shiftKey) setShift(false);
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	return { shift };
};
