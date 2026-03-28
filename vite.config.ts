import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const root = path.resolve(__dirname)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
      // Explicit alias to work around Rollup path-with-spaces resolution bug
      'lucide-react': path.join(root, 'node_modules/lucide-react/dist/esm/lucide-react.js'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
    force: true,
  },
})
