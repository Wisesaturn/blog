import type { StorybookConfig } from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { Options } from '@swc/core';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-viewport',
    'storybook-dark-mode',
    '@storybook/addon-interactions',
    // set tailwindCSS and postCSS, CSS Loader
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
        cssLoaderOptions: {
          importLoaders: 1,
          modules: {
            auto: true,
            localIdentName: '[name]__[local]--[hash:base64:5]',
          },
        },
        styleLoaderOptions: {},
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  swc: (config: Options, options): Options => {
    return {
      ...config,
      // automatic React import (SWC)
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    };
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ];
    }
    return config;
  },
};
export default config;
