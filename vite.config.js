import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      // Configuración para manejar peticiones si es necesario
    },
  },
  resolve: {
    alias: {
      // Aliases para resolver rutas si es necesario
    },
  },
});
