import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      'plugin:tailwindcss/recommended',   // ✅ Add Tailwind recommended config
    ],
    plugins: {
      tailwindcss: tailwind,  // ✅ Register plugin
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl'], // If you use these helpers
        config: 'tailwind.config.js',           // Ensure it points to your Tailwind config
      },
    },
  },
])
