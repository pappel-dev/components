module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "semi-spacing": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-alert": "error",
        "max-classes-per-file": [
            "error",
            1
        ],
        "comma-spacing": "error",
        "eol-last": "error",
        "keyword-spacing": "error",
        "key-spacing": "error",
        "max-params": [
            "error",
            4
        ],
        "complexity": [
            "error",
            10
        ],
        "max-depth": "error",
        "max-lines-per-function": [
            "error",
            {
                "max": 40,
                "skipBlankLines": true,
                "skipComments": true
            }
        ],
        "max-statements-per-line": "error",
        "no-trailing-spaces": "error",
        "one-var": [
            "error",
            "never"
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "prefer-object-spread": "error",
        "sort-keys": [
            "error",
            "asc",
            {
                "natural": true
            }
        ],
        "sort-imports": "error"
    }
};
