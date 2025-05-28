const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    port: 3000,  // 원하는 포트로 변경 (예: 3000)
  },
}
