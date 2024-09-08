const config = require('./w.config');
const path = require('path');

// production环境配置
module.exports = {
  devtool: config.devtool,
  entry: config.entry,
  output: {
    path: path.join(__dirname, 'docs'),
    filename: `app-${config.version}.js`,
  },
  module: {
    rules: config.loaders,
  },
  plugins: config.productionPlugins,
  mode: 'production',
};
