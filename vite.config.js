import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',   // ahora Vite toma src/ como raíz del proyecto
  build: {
    outDir: '../dist'  // importante: ajustá la salida porque sino queda dentro de src/dist
  }
})
