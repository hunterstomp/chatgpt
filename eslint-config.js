import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    rules: {
      // Code Quality
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Best Practices
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // Styling
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // ES6+
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      
      // Naming Conventions
      'camelcase': ['error', { properties: 'always' }],
      'no-underscore-dangle': 'error',
      'id-match': ['error', '^[a-zA-Z_$][a-zA-Z0-9_$]*$'],
      
      // React Naming Conventions (when React is available)
      'react/jsx-pascal-case': 'error',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    },
    ignores: [
      'dist/',
      'node_modules/',
      '*.min.js',
      'public/',
      'backend/',
      'scripts/',
      'src/admin/',
      'src/components/*.js',
      'src/instant-upload/',
      'src/optimized-gallery-demo/',
      'src/preview/',
      'src/scripts/',
      'src/serial-upload/',
      'src/smart-upload/',
      'src/types/',
      'src/utils/',
      'src/hooks/'
    ],
  },
];
