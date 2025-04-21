/*
 * @Descripttion:
 * @Author: peiqf
 * @Date: 2022-12-19 15:37:11
 * @LastEditors: peiqf
 * @LastEditTime: 2025-04-21 10:54:00
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import eslint from "vite-plugin-eslint";
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        eslint({ 
          include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"]
        })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData:
                    '@import "./src/common/scss/var.scss";@import "./src/common/scss/mixin.scss";',
            },
        },
    },
    server: {
        host: '0.0.0.0',
        port: 12000,
        proxy: {
            '/local': {
                target: 'https://172.17.11.59:1111/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/local/, ''),
            },
        },
    },
});
