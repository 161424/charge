import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/

// const { resolve } = require('path')

export default defineConfig({
  // 起个别名，在引用资源时，可以用‘@/资源路径’直接访问
  // resolve: {
  //   alias: {
  //     "@": resolve(__dirname, "src"),
  //   },
  // },
  plugins: [vue()],
  // 配置前端服务地址和端口
  server: {
    host: '127.0.0.1',
    port: 8999,
    // 是否开启 https
    https: false,
    // 设置反向代理，跨域
    proxy: {
      '/api': {
        // 后台地址
        target: 'http://localhost:2025',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
        // pathRewrite:{
        //   '^/api':''//重写路径
        // }
      },
    }
  },

})
