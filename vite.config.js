import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [
        react({
            // React 19 Compiler support - Disabled temporarily due to Vite compatibility
            // babel: {
            //     plugins: [['babel-plugin-react-compiler', {}]]
            // }
        })
    ],
    resolve: {
        alias: {
            '@data': resolve(__dirname, 'src/data'),
            '@components': resolve(__dirname, 'src/components'),
            '@containers': resolve(__dirname, 'src/containers'),
            '@views': resolve(__dirname, 'src/views'),
            '@bridges': resolve(__dirname, 'src/bridges'),
            '@assets': resolve(__dirname, 'src/assets'),
            '@utils': resolve(__dirname, 'src/utils')
        }
    },
    server: {
        port: 5173,
        strictPort: false
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'supabase': ['@supabase/supabase-js']
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js'
    }
});
