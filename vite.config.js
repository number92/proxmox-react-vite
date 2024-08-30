import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('/home/arav/.ssl/dev.iqdata.key'),
      cert: fs.readFileSync('/home/arav/.ssl/dev.iqdata.crt'),
    }
  }, // Not needed for Vite 5+
  plugins: [react()]

})
