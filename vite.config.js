import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env variables from system process & env files
  const env = loadEnv(mode, process.cwd(), '');
  
  // Cross check if Vercel build environment is active
  const isVercel = 
    env.VERCEL === '1' || 
    env.VERCEL === 'true' || 
    process.env.VERCEL === '1' || 
    process.env.VERCEL === 'true' ||
    process.env.VERCEL_ENV !== undefined;

  return {
    plugins: [react()],
    base: isVercel ? '/' : './',
    server: {
      port: 5173,
      strictPort: true,
    },
  }
})
