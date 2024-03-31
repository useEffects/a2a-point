module.exports = {
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    rules: {
        "no-unused-vars": "off"
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
};