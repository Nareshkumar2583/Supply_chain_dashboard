// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindConfig from './tailwind.config.js'

export default defineConfig({
  plugins: [react()],
  define: {
    TAILWIND_COLORS: JSON.stringify(tailwindConfig.theme.colors)
  }
})
