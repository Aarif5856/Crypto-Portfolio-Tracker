import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom'],
          // wallet chunk removed to avoid resolving optional packages during build
          ui: ['lucide-react', 'recharts', 'framer-motion'],
          utils: ['axios', 'clsx']
        }
      }
    }
  }
})



