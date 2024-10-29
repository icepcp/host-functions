import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts', // Change this path to your main TS file
            formats: ['cjs'],
        },
    },
});