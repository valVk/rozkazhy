import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves project sites from /<repo>/, not the domain root.
export default defineConfig({
  base: '/rozkazhy/',
  plugins: [vue(), tailwindcss()],
})
