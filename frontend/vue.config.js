// ensure env
['VUE_APP_ADDITION_HEAD'].forEach(name => (process.env[name] = process.env[name] || ''));

module.exports = {
  publicPath: process.env.GITHUB_REPOSITORY
    ? `https://cdn.jsdelivr.net/gh/${process.env.GITHUB_REPOSITORY}@gh-pages/`
    : '',
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    externals: {
      vue: 'Vue',
    },
    performance: {
      hints: false,
    },
  },
  chainWebpack: config => {
    config.plugins.delete('preload').delete('prefetch');
  },
  devServer: {
    proxy: {
      '/shorten': {
        target: 'http://localhost:7000',
      },
    },
  },
};
