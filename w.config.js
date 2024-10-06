const webpack = require("webpack");
const path = require("path");
// const { WebpackOpenBrowser } = require('webpack-open-browser');
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const precss = require("precss");
const postcssPresetEnv = require("postcss-preset-env"); // Replace precss
const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const version = require("./package.json").version;

// 程序入口
const entry = path.resolve(__dirname, "src/index.js");

// 输出文件
const output = {
  filename: "page/[name]/index.js",
  chunkFilename: "chunk/[name].[chunkhash:5].chunk.js",
};

// 生成source-map追踪js错误
const devtool = "source-map";

// loader
const rules = [
  // {
  //   test: /\.(json)$/,
  //   exclude: /node_modules/,
  //   loader: "json",
  // },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      "babel-loader", // Use babel-loader instead of just 'babel'
    ],
  },
  {
    test: /\.(?:png|jpg|gif)$/,
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: 8192, // Inline files smaller than 8k
      },
    },
  },
  {
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[hash:base64:4]",
          },
        },
      },
      "postcss-loader",
      {
        loader: "less-loader",
        options: {
          lessOptions: {
            javascriptEnabled: true, // Allows using JavaScript in Less files
          },
        },
      },
    ],
    include: path.resolve(__dirname, "src"),
  },
  {
    test: /\.css$/,
    use: [
      "style-loader", // Injects styles into the DOM
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
        },
      }, // Translates CSS into CommonJS
      {
        loader: "postcss-loader", // Processes CSS with PostCSS
        options: {
          postcssOptions: {
            plugins: [
              postcssPresetEnv(), // Your custom PostCSS plugins
              autoprefixer,
            ],
          },
        },
      },
    ],
  },
];

// dev plugin
const devPlugins = [
  new CopyWebpackPlugin({
    patterns: [
      { from: "./src/resource/music/music.mp3" },
      { from: "./src/resource/css/loader.css" },
    ],
  }),
  // 允许错误不打断程序, 仅开发模式需要
  // new WebpackOpenBrowser({
  //   url: "http://127.0.0.1:8080/",
  // }),
  // css打包

  new MiniCssExtractPlugin({
    filename: "css.css",
    chunkFilename: "[id].css",
  }),
  new ESLintPlugin({
    context: __dirname,
    // You can add other ESLint options here if needed
    extensions: ["js", "jsx", "ts", "tsx"], // Adjust according to your project
    eslintPath: require.resolve("eslint"),
    failOnError: false, // Adjust according to your needs
    // Additional options can be specified here
  }),
];

// production plugin
const productionPlugins = [
  // 定义生产环境
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": '"production"',
  }),
  // 复制
  new CopyWebpackPlugin({
    patterns: [
      { from: "./src/resource/music/music.mp3" },
      { from: "./src/resource/css/loader.css" },
    ],
  }),
  // HTML 模板
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "server/index.tmpl.html"),
  }),
  // JS压缩
  new TerserPlugin({
    terserOptions: {
      compress: {
        warnings: false,
      },
    },
  }),
  // css打包
  new MiniCssExtractPlugin({
    filename: `css-${version}.css`,
    chunkFilename: "[id].css",
  }),
  // Eslint
  // intentionally disabled this due to bundle of errors because of strict configurations
  // new ESLintWebpackPlugin()
];

// dev server
const devServer = {
  static: {
    directory: path.join(__dirname, "server"),
  },
  historyApiFallback: false,
  port: 8080, // defaults to "8080"
  host: "0.0.0.0",
  allowedHosts: "all",
  liveReload: true,
  hot: true,
};

module.exports = {
  entry,
  devtool,
  output,
  rules,
  devPlugins,
  productionPlugins,
  devServer,
  version,
};
