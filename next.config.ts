import type { NextConfig } from 'next'

process.env.TURBOPACK = '0'
process.env.NEXT_PRIVATE_BUILD_WITH_TURBOPACK = '0'

const nextConfig: NextConfig = {
  distDir: '.next-app',

  // Windows 环境修复 sourcemap 报错
  productionBrowserSourceMaps: false,
  webpack(config) {
    config.devtool = false // 禁用 sourcemap
    return config
  },

  // React Compiler 可保留，如果报错可关闭
  reactCompiler: true,
}

export default nextConfig
