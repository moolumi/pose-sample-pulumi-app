module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        // Enforce consistent indentation
        'indent': ['error', 4],
        // Enforce consistent line endings
        'linebreak-style': ['error', 'unix'],
        // Enforce consistent quote style
        'quotes': ['error', 'double'],
        // Require semicolons
        'semi': ['error', 'always'],
        // Disallow unused variables
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        // Disallow console.log in production (warning only)
        'no-console': 'warn',
        // Require const for variables that are never reassigned
        'prefer-const': 'error',
        // Disallow var declarations
        'no-var': 'error',
    },
    globals: {
        // Pulumi globals
        'exports': 'writable',
        'require': 'readonly',
        'module': 'readonly',
        '__dirname': 'readonly',
        '__filename': 'readonly',
        'process': 'readonly',
        'Buffer': 'readonly',
        'console': 'readonly',
    },
};