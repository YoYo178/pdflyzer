import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['react', 'typescript', 'oxc'],

  categories: {
    correctness: 'warn',
  },

  rules: {
    'eslint/no-unused-vars': 'error',

    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  },
});
