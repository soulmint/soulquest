module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2019,
	},
	plugins: [
		'import',
		'react',
		'react-hooks',
		'@typescript-eslint/eslint-plugin',
		'prettier',
	],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'prettier',
	],
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/display-name': 'off',
		'react/prop-types': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/naming-convention': [
			'off',
			{
				selector: 'interface',
				format: ['PascalCase'],
				custom: {
					regex: '^I[A-Z]',
					match: false,
				},
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
			},
		],
		"prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
		'no-console': [
			'error',
			{
				allow: ['warn', 'error', 'log', 'info'],
			},
		],
		'react/self-closing-comp': 'error',
		'object-shorthand': ['error', 'always'],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
