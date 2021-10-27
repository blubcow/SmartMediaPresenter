import { useState, useEffect } from 'react';
import { darkTheme } from '../smpUI/smpUITheme';
import usePreferredTheme from './usePreferredTheme';

const logoRefs = {
	toolbarLight: 'resources/toolbar-logo-light.png',
	toolbarDark: 'resources/toolbar-logo-dark.png',
	logoLight: 'resources/logo-light.png',
	logoDark: 'resources/logo-dark.png',
};

const useThemedLogo = () => {
	const { preferredTheme } = usePreferredTheme();
	const [toolbarLogo, setToolbarLogo] = useState(
		preferredTheme === darkTheme ? logoRefs.toolbarDark : logoRefs.toolbarLight
	);
	const [logo, setLogo] = useState(
		preferredTheme === darkTheme ? logoRefs.logoDark : logoRefs.logoLight
	);

	useEffect(() => {
		setToolbarLogo(
			preferredTheme === darkTheme
				? logoRefs.toolbarDark
				: logoRefs.toolbarLight
		);
		setLogo(
			preferredTheme === darkTheme ? logoRefs.logoDark : logoRefs.logoLight
		);
	}, [preferredTheme]);

	return { toolbarLogo, logo };
};

export default useThemedLogo;
