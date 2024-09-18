import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My React App',
        short_name: 'ReactApp',
        description: 'My React App description',
        theme_color: '#ffffff'
        // Icons can be omitted if not needed
      }
    })
  ]
});
