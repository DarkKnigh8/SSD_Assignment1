import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API calls → backend
      '/api': 'http://localhost:5004',
    },
    // ❌ Remove headers here. CSP should be managed by backend (Helmet)
    headers: {},
  },
});
