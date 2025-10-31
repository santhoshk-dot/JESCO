import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        darkMode: 'class', 
        theme: {
          extend: {
            
          },
        },
        plugins: [],
      },
    }),
  ],
  server: {
    historyApiFallback: true,
  },
})
