const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const precss = require('precss');
// const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const version = require('./package.json').version;
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");


const isProductionMode = process.env.NODE_ENV === "production";


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
      // isProductionMode ? MiniCssExtractPlugin.loader : "style-loader",
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: '[hash:base64:5]',  // Custom class name pattern
          },
          // importLoaders: 1,
          // sourceMap: true,
        },
      },
      {
        loader: "postcss-loader",
        // options: {
        //   postcssOptions: {
        //     plugins: [
        //       "autoprefixer",
        //     ],
        //   },
        //   sourceMap: true,
        // },
      },
      {
        loader: "less-loader",
        // options: {
        //   implementation: require("less"),
        //   sourceMap: true,
        // },
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
  // css打包
  new MiniCssExtractPlugin(),
];

// dev server
const devServer = {
  historyApiFallback: false,
  port: 8080, // defaults to "8080"
  host: '0.0.0.0',
  open: false,
  // open: true,
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
      }),
    ],
  },
};
