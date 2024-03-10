/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        'no-explicit-any': 'warn',
        'no-unused-vars': 'warn',
        'no-undef': 'warn',
        'prefer-const': 'warn',
        'semi': 'warn'
    },
    root: true,
};