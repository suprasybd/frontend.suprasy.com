/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: './',
    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    plugins: [react(), TanStackRouterVite()],

    build: {
      outDir: 'dist',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    // Pass env variables to your app
    define: {
      'process.env': env,
    },
  };
});
