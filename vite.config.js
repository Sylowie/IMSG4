import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  ssr: false, //to resolve some error
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['jwt-decode'], // Force Vite to optimize jwt-decode
    exclude: ['path', 'url'],
  },

});
