module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		es6: true,
		"jest/globals": true,
	},
	extends: [
		'airbnb-typescript',
		'plugin:jest/all'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: [
		'react-hooks',
	],
	rules: {
		'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
		'indent': [2, 'tab', {SwitchCase: 1, ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],}],
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
		'@typescript-eslint/indent': [2, 'tab'],
		'no-tabs': 0,
		'react/destructuring-assignment': [0],
		'react/prop-types': 0,
		'react/no-unused-state': 1,
		'max-len': 1,
		'no-param-reassign': 0,
		'jsx-a11y/click-events-have-key-events': 0,
		'no-underscore-dangle': 0,
		'jest/no-hooks': 0,
		'react-hooks/exhaustive-deps': 1,
	},
};
