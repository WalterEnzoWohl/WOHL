import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetPlugin() {
  return {
    name: 'figma-asset-resolver',
    resolveId(source: string) {
      if (!source.startsWith('figma:asset/')) {
        return null
      }

      const filename = source.slice('figma:asset/'.length)
      return path.resolve(__dirname, 'src/assets', filename)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
