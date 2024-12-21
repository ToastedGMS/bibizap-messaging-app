import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	root: './react',
	server: {
		host: '0.0.0.0', // Allow access from network devices
	},
	plugins: [react()],
});
