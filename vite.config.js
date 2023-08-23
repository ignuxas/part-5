import { defineConfig } from "vitest/config";
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  define: {
    BASE_URL: JSON.stringify('http://127.0.0.1:8090/api')
  },
})
