const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/common/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.[chunkhash:8].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack',
      filename: "index.html",
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css'
    }),
    new CopyWebpackPlugin([
      {from: path.resolve(process.cwd(),'src/common/img/'),to:'common/img'}
    ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: [
          {
            loader:'url-loader',
            options:{
              limit:1024,
              name:'img/[name].[ext]',
              publicPath:'/'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true
  }
}