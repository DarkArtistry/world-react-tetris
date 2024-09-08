const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const precss = require('precss');
// const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const version = require('./package.json').version;
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");


// 程序入口
const entry = path.join(__dirname, '/src/index.js');

// 输出文件
const output = {
  filename: 'page/[name]/index.js',
  chunkFilename: 'chunk/[name].[chunkhash:5].chunk.js',
};

// 生成source-map追踪js错误
const devtool = 'source-map';

// eslint
const eslint = {
  configFile: __dirname + '/.eslintrc.js',
}

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
  // {
  //   test: /\.(?:png|jpg|gif)$/,
  //   loader: 'url?limit=8192', //小于8k,内嵌;大于8k生成文件
  // },
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
  // {
  //   test: /\.less/,
  //   loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[hash:base64:4]!postcss!less'),
  // }
  {
    test: /\.less$/i,
    use: [
      // compiles Less to CSS
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: true,
          importLoaders: 1,
        },
      },
      // "postcss-loader",
      {
        loader: "less-loader",
        options: {
          implementation: require("less"),
        },
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
  // 热更新
  new webpack.HotModuleReplacementPlugin(),
  // 允许错误不打断程序, 仅开发模式需要
  new webpack.NoEmitOnErrorsPlugin(),
  // 打开浏览器页面
  // new OpenBrowserPlugin({
  //   url: 'http://127.0.0.1:8080/'
  // }),
  // css打包
  new MiniCssExtractPlugin(),
]

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
    ]
  }),
  // HTML 模板
  new HtmlWebpackPlugin({
    template: __dirname + '/server/index.tmpl.html'
  }),
  // JS压缩
  // new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: false
  //   }
  // }
  // ),
  // css打包
  new MiniCssExtractPlugin(),
];

// dev server
const devServer = {
  historyApiFallback: false,
  port: 8080, // defaults to "8080"
  hot: true, // Hot Module Replacement
  host: '0.0.0.0',
  open: true,
  static: {
    directory: __dirname + '/server',
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
  // postcss: function () {
  //   return [precss, autoprefixer];
  // },
  version,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        // `terserOptions` options will be passed to `uglify-js`
        // Link to options - https://github.com/mishoo/UglifyJS#minify-options
        terserOptions: {},
      }),
    ],
  },
};
