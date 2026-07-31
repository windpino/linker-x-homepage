import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Check if running on Vercel build environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || process.env.VERCEL_ENV !== undefined;

export default defineConfig({
  plugins: [react()],
  base: isVercel ? '/' : './',
  server: {
    port: 5173,
    strictPort: true,
  },
})
