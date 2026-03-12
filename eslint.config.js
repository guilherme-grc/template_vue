import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        process: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        URL: 'readonly',
        new: 'readonly',
        Promise: 'readonly',
        Blob: 'readonly',
        confirm: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'error'
    }
  }
];
