import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@core': path.resolve(__dirname, 'src/blackjack/core'),
            '@app-types': path.resolve(__dirname, 'src/types'),
            '@util': path.resolve(__dirname, 'src/util'),
            '@strategy': path.resolve(__dirname, 'src/strategy'),
            '@logic': path.resolve(__dirname, 'src/logic'),
            '@stores': path.resolve(__dirname, 'src/stores'),
            '@background': path.resolve(__dirname, 'src/components/background'),
            '@feedback': path.resolve(__dirname, 'src/components/feedback'),
            '@game': path.resolve(__dirname, 'src/components/game'),
            '@settings': path.resolve(__dirname, 'src/components/settings'),
        },
    },
    base: '/blackjack-trainer/',
})
