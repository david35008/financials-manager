const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      "/api/": {
        target: "http://localhost:9000/api/"
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
})
