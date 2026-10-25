import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

function resolveAlias(pathString: string) {
  return path.resolve(import.meta.dirname, pathString);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolveAlias('src'),
    },
  },
});
