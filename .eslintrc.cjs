module.exports = {
	root: true,
	env: { browser: true, es2020: true, es6: true, node: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'plugin:prettier/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	settings: { react: { version: '18.2' } },
	plugins: ['react-refresh', 'prettier'],
	rules: {
		'react/jsx-no-target-blank': 'off',
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'no-console': 'warn',
		'no-debugger': 'warn',
		'no-unused-vars': 'warn',
		'react/prop-types': 'off',
		'prettier/prettier': [
			'off',
			{
				endOfLine: 'auto',
			},
		],
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		"react/display-name": "off",
	},
};
