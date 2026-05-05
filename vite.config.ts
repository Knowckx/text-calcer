import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert';
import path from "path"
import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './src/config/site'

export default defineConfig({
    plugins: [
        react(), mkcert(), tailwindcss(),
        {
            name: 'inject-bing-site-verification',
            transformIndexHtml(html) {
                if (!siteConfig.bingVerifyCode) {
                    return html
                }

                return html.replace(
                    '</head>',
                    `    <meta name="msvalidate.01" content="${siteConfig.bingVerifyCode}" />\n  </head>`,
                )
            },
        },
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['pwa-512x512.png'], // 添加图标到缓存
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,svg,woff,woff2}'] // 缓存所有常见的静态资源
            },
            manifest: {
                name: 'text-calcer',
                short_name: 'text-calcer',
                description: 'Description',
                theme_color: '#ffffff',
                // orientation: "landscape-primary", // 优先横屏
                icons: [
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    }
                ],
            },
        })
    ],
    base: '/',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        https: {}, // 开启 HTTPS
        port: 3000,
        host: true,
    },
    preview: {
        port: 22006,
        host:true  // 允许外部访问
    },
})
