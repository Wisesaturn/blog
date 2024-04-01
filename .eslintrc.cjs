/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',
    'import/no-named-as-default': 'off',
    'import/no-duplicates': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        css: 'never',
      },
    ],
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-warning-comments': [
      'warn',
      {
        terms: ['TODO', 'FIXME', 'XXX', 'BUG', 'HOLD'],
        location: 'anywhere',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
  },
  globals: {
    NodeJS: true,
  },

  // Base config
  extends: ['airbnb-base', 'eslint-config-prettier'],

  overrides: [
    // React
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'jsx-a11y', 'prettier'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      rules: {
        'react/no-unknown-property': ['error', { ignore: ['color-theme', 'css'] }],
        'react/display-name': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': ['off'],
        'react/jsx-no-target-blank': 'error',
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              ['sibling', 'parent', 'index'],
              'type',
              'unknown',
            ],
            pathGroups: [
              {
                pattern: '{remix*,remix*/**}',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '$app/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '$pages/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '$features/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '$shared/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '**/atoms/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '**/molecules/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '**/organisms/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '$styles/**',
                group: 'unknown',
              },
            ],
            'newlines-between': 'always',
          },
        ],
      },
      settings: {
        react: {
          version: 'detect',
        },
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
        'import/resolver': {
          typescript: {},
        },
      },
    },

    // StoryBook
    {
      files: ['**/*.stories.{ts,tsx}'],
      extends: ['plugin:storybook/recommended'],
      rules: {
        'no-alert': 'off',
      },
    },

    // Typescript
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint', 'import'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            selector: 'variable',
            leadingUnderscore: 'allowDouble',
          },
          {
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            selector: 'variable',
            leadingUnderscore: 'allow',
          },
          { format: ['camelCase', 'PascalCase'], selector: 'function' },
          { format: ['PascalCase'], selector: 'interface' },
          { format: ['PascalCase'], selector: 'typeAlias' },
        ],
      },
      settings: {
        'import/internal-regex': '^$/',
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx'],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
    },

    // Node
    {
      files: ['.eslintrc.cjs'],
      env: {
        node: true,
      },
    },
  ],
};
