import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project at https://takeda-app.github.io/ekidoko/,
  // so production assets need that path prefix. Local dev keeps root ("/").
  base: command === 'build' ? '/ekidoko/' : '/',
  plugins: [react()],
}))
