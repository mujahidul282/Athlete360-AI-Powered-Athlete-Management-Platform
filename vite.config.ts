import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Assuming this is the correct import path

export default defineConfig(({ mode }) => {
    // 1. Load environment variables
    // Note: Vite recommends VITE_ prefix for client-side environment variables
    const env = loadEnv(mode, '.', '');

    return {
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        
        // 2. COMBINED PLUGINS ARRAY
        plugins: [
            react(), // The React plugin
            tailwindcss(), // The Tailwind plugin
        ],
        
        // 3. Define the environment variables for your app
        // Using 'process.env.VITE_...' is the standard pattern for Vite
        define: {
            'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            // You can remove the duplicate 'process.env.API_KEY' unless your app specifically uses it
        },
        
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});
