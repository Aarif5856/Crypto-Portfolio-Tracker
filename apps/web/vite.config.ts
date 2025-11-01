import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: Number(process.env.WEB_PORT || 5173)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});

