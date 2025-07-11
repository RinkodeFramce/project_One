import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "primevue/resources/themes/lara-light-blue/theme.css";
          @import "primevue/resources/primevue.min.css";
          @import "primeicons/primeicons.css";
        `
      }
    }
  },
  optimizeDeps: {
    include: ['primevue/ripple']
  }
})
