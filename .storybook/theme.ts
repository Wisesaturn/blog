import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  colorPrimary: ' #50ad63',
  colorSecondary: '#326E3E',

  // UI
  appBg: 'white',
  appContentBg: 'white',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase:
    '"Pretendard", "Pretendard Variable", "-apple-system", "BlinkMacSystemFont", "Tossface", "system-ui", "Roboto", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'white',

  // Toolbar default and active colors
  barTextColor: '#343434',
  barSelectedColor: '#449454',
  barBg: 'white',

  // Form colors
  inputBg: 'white',
  inputBorder: '#449454',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: '📚 사툰사툰',
  brandUrl: 'https://jaehan.blog',
});
