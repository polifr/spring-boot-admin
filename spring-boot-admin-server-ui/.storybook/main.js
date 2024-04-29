const path = require('path');
const frontend = path.resolve(__dirname, '../src/main/frontend/');

module.exports = {
  stories: [
    {
      directory: frontend,
    },
  ],
  docs: {
    autodocs: true,
  },
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: 'vue-component-meta',
    },
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': frontend,
        },
      },
    });
  },
};
