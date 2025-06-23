module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    },
    rules: {
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          ignoredNodes: ['ConditionalExpression']
        }
      ]
      // Add or override any rules as necessary
    }
  }
};
