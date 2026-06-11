import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Greenify/', // Adjust this to match your EXACT repository name capitalization
})