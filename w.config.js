const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { version } = require('./package.json');
// const ESLintWebpackPlugin = require('eslint-webpack-plugin');

// 程序入口
const entry = path.join(__dirname, '/src/index.js');

// 输出文件
const output = {
  filename: 'page/[name]/index.js',
  chunkFilename: 'chunk/[name].[chunkhash:5].chunk.js',
};

// 生成source-map追踪js错误
const devtool = 'source-map';

// loader
const loaders = [
  {
    test: /\.(?:js|mjs|cjs|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', {
            targets: 'defaults',
          }]
        ],
      }
    }
  },
  {
    test: /\.(png|jpg|gif)$/i,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  {
    test: /\.less$/i,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: '[hash:base64:5]',
          },
        },
      },
      {
        loader: "postcss-loader",
      },
      {
        loader: "less-loader",
      },
    ],
  },
];

// dev plugin
const devPlugins = [
  new CopyWebpackPlugin({
    patterns: [
      { from: './src/resource/music/music.mp3' },
      { from: './src/resource/css/loader.css' },
    ]
  }),
  // 允许错误不打断程序, 仅开发模式需要
  new webpack.NoEmitOnErrorsPlugin(),
  // 打开浏览器页面
  // css打包
  new MiniCssExtractPlugin({
    filename: 'css/[name].css',
  }),
  // HTML 模板
  new HtmlWebpackPlugin({
    template: path.join(__dirname, '/server/index.tmpl.html'),
  }),
  // Eslint
  // new ESLintWebpackPlugin() // intentionally disabled this due to bundle of errors because of strict configurations
];

// production plugin
const productionPlugins = [
  // 定义生产环境
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),
  // 复制
  new CopyWebpackPlugin({
    patterns: [
      { from: './src/resource/music/music.mp3' },
      { from: './src/resource/css/loader.css' },
    ],
  }),
  // HTML 模板
  new HtmlWebpackPlugin({
    template: path.join(__dirname, '/server/index.tmpl.html'),
  }),
  // css打包
  new MiniCssExtractPlugin({
    filename: 'css/[name].css',
  }),
  // Eslint
  // new ESLintWebpackPlugin() // intentionally disabled this due to bundle of errors because of strict configurations
];

// dev server
const devServer = {
  historyApiFallback: false,
  port: 8080, // defaults to "8080"
  host: '0.0.0.0',
  open: true,
  static: {
    directory: path.join(__dirname, 'server'),
  },
};

module.exports = {
  entry,
  devtool,
  output,
  loaders,
  devPlugins,
  productionPlugins,
  devServer,
  version,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
      }),
    ],
  },
};
