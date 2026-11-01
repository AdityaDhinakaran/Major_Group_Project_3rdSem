import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Major_Group_Project_3rdSem/',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3001' } },
});
