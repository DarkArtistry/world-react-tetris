var config = require('./w.config');

// dev环境配置
module.exports = {
  devtool: config.devtool,
  entry: config.entry,
  output: {
    path: __dirname + '/server',
    filename: 'app.js',
  },
  // eslint: config.eslint,
  module: {
    rules: config.loaders
  },
  plugins: config.devPlugins,
  devServer: config.devServer,
  mode: 'development'
  // postcss: config.postcss
};
