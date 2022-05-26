const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
        path: false,
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ffa-v2/'
    : '/'
});
