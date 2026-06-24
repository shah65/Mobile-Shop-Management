import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src/frontend',
  plugins: [react()],
  base: './', // important for Electron - relative paths, not absolute
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
});
