import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), eslint()],
	server: { port: 3000 },
	define: {
		"process.env": {
			VITE_SECURE_LOCAL_STORAGE_HASH_KEY: 'd05dc2deb4abc76f53ebe9329dce76c42d9652d2',
			VITE_SECURE_LOCAL_STORAGE_PREFIX: 'soderia-la-nueva'
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			all: false, // Only include files that have been imported in tests
			include: ['src/*.{js,jsx,ts,tsx,vue}', 'src/*.test.jsx']
		}
	}
})
