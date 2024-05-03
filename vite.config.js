import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist'
    },
    server: { https: true }, // Not needed for Vite 5+
    plugins: [ mkcert() ]
})