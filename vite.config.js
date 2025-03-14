import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	root: './react',
	server: {
		host: '0.0.0.0', // Allow access from network devices
	},
	plugins: [react()],
	css: { modules: { scopeBehaviour: 'local' } },
	envDir: '../',
});
