import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';
export default defineConfig({root:'web',publicDir:'../public',plugins:[react()],build:{outDir:'../portable-dist',emptyOutDir:true},server:{host:'127.0.0.1'}});
