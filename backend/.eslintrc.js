module.exports = {
	env: {
		es6: true,
		node: true
	},
	extends: [
		'airbnb-base'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	rules: {
		indent: [
			2,
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 1
			}
		],
		'no-tabs': 0,
		'no-param-reassign': 0,
		'no-underscore-dangle': 0,
		'max-len': 1,
	}
}
