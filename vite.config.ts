import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/clampwind-dev/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    // GitHub Pages serves this branch directly (Settings -> Pages -> main /docs),
    // so docs/ is committed. Run `npm run build` before pushing or the live
    // site keeps serving the previous build. Only / and /docs are selectable.
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: 'index.html',
        card: 'card.html'
      }
    }
  }
})