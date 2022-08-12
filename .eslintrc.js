module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "max-len": ["error", { "code": 120 }],
    "comma-dangle": ["error", "always-multiline"],
  },
  "overrides": [
    {
      "files": ["*.spec.js"],
      "rules": {
        "max-len": "off",
      },
    },
  ],
}
