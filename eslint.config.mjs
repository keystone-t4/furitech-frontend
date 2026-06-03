// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierConfig from 'eslint-config-prettier'

export default withNuxt([
  prettierConfig,
  {
    rules: {
      'no-console': ['warn', { allow: ['error'] }],
      'vue/html-button-has-type': 'error',
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
])
