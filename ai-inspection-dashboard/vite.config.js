import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/IQE/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
    host: '0.0.0.0',
    strictPort: false,
    hmr: {
      overlay: false
    }
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'echarts': ['echarts/core']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['element-plus', '@element-plus/icons-vue', 'echarts/core']
  }
})
