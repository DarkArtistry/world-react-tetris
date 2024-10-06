const path = require("path");
const config = require("./w.config");

// production环境配置
module.exports = {
  mode: "production",
  devtool: config.devtool,
  entry: config.entry,
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: `app-${config.version}.js`,
  },
  // eslint: config.eslint,
  module: {
    rules: config.rules,
  },
  plugins: config.productionPlugins,
};
