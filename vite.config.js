import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        globals: true,
    },
    build: {
        assetsDir: "assets",
    },
    server: {
        proxy: {
            // Proxy all requests starting with a single character (short codes) to the backend
            '^/[a-zA-Z0-9]{7}$': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});
