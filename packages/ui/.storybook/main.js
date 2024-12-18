const config = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: [
    '../stories/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  docs: {
    autodocs: 'tag',
  },
};

module.exports = config;
