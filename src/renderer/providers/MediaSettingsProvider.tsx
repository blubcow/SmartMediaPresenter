import React, { MutableRefObject, PropsWithChildren, createContext, useContext, useRef } from 'react';

export const MediaSettingsContext = createContext({});

export const MediaSettingsProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <MediaSettingsContext.Provider value={{ ref }}>
      {children}
    </MediaSettingsContext.Provider>
  );
}

export const useMediaSettingsContext = () => {
	const context = useContext(MediaSettingsContext) as {
		ref: MutableRefObject<HTMLElement>;
	};
	if (!context)
		throw new Error(
			'useMediaSettingsContext hook has to be called inside of an MediaSettingsProvider!'
		);

	return context;
};
