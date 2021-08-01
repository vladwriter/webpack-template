const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = ()=>{
  const config = {
    splitChunks: {
        chunks: 'all'
    }
}
  if(isProd){
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}

const filename = ext => isDev ? `[name].${ext}`:`[name].[hash].${ext}`

const cssLoaders = extra =>{
  const loaders = [{
    loader: MiniCssExtractPlugin.loader,
    options: {},
  },
  "css-loader"
]
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filename('js')
  },
    resolve:{
        extensions:['.js', '.json', '.png'],
        alias:{
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer:{
        port: 4200,
        hot: isDev
    },
  plugins:[
      new HTMLWebpackPlugin({
          template: './index.html',
          minify:{
            collapseWhitespace: isProd
          }
      }),
       new CleanWebpackPlugin(),
       new CopyWebpackPlugin({
        patterns:[
            {
               from: path.resolve(__dirname, 'src/favicon.ico'),
               to: path.resolve(__dirname, 'dist')
          }
        ]
       }),
       new MiniCssExtractPlugin({
            filename: filename('css')
       })
  ],
  module:{
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: cssLoaders()
          },
          {
            test: /\.less$/,
            use: cssLoaders('less-loader')
        },
        {
          test: /\.s[ac]ss$/,
          use: cssLoaders('sass-loader')
      },
          {
              test: /\.(png|jpg|svg|gif)$/,
              use: ['file-loader']
          },
          {
            test: /\.(ttf|woff|woff2|eot)$/,
            use: ['file-loader']
          },
          {
            test: /\.xml$/,
            use: ['xml-loader']
          },
          {
            test: /\.csv$/,
            use: ['csv-loader']
          }
      ]
  }
}