import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    exclude: ['@zegocloud/zego-uikit-prebuilt']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'zego-uikit-prebuilt': ['@zegocloud/zego-uikit-prebuilt']
        }
      }
    }
  }
})