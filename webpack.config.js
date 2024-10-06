const path = require("path");
const config = require("./w.config");

// dev环境配置
module.exports = {
  mode: "development",
  devtool: config.devtool,
  entry: config.entry,
  output: {
    path: path.resolve(__dirname, "server"),
    filename: "app.js",
  },
  module: {
    rules: config.rules,
  },
  plugins: config.devPlugins,
  devServer: config.devServer,
};
