import React, { PropsWithChildren, createContext } from 'react';

export const PresentationEditingContext = createContext(undefined);

const PresentationEditingProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	return (
		<PresentationEditingContext.Provider value={undefined}>
			{children}
		</PresentationEditingContext.Provider>
	);
};

export default PresentationEditingProvider;
