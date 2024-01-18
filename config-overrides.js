// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { useBabelRc, addBabelPlugins, override } = require("customize-cra");
//module.exports = override(useBabelRc());

module.exports = override(
	...addBabelPlugins(
		"@babel/plugin-proposal-nullish-coalescing-operator"
		/* Add plug-in names here (separate each value by a comma) */
	)
);