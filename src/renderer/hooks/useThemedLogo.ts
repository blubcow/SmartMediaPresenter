import { useState, useEffect } from 'react';
import { darkTheme } from '../smpUI/smpUITheme';
import usePreferredTheme from './usePreferredTheme';
import toolBarLogoLight from '../../../assets/resources/toolbar-logo-light.png';
import toolBarLogoDark from '../../../assets/resources/toolbar-logo-dark.png';
import logoLight from '../../../assets/resources/logo-light.png';
import logoDark from '../../../assets/resources/logo-dark.png';

const logoRefs = {
	toolbarLight: toolBarLogoLight,
	toolbarDark: toolBarLogoDark,
	logoLight: logoLight,
	logoDark: logoDark,
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
