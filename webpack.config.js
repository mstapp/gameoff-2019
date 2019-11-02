const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const isProduction = process.env.npm_lifecycle_event === 'build'

module.exports = {
  entry: './src',
  // resolve: {
  //   alias: {
  //     'src': path.join(__dirname, '/src'),
  //     'libs': path.join(__dirname, '/src/libs'),
  //   }
  // },
  devtool: !isProduction && 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      // minify: isProduction && {
      //   collapseWhitespace: true
      // },
      minify: isProduction,
      inlineSource: isProduction && '\.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new OptimizeCssAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyWebpackPlugin([
      { from: './src/assets/**/*', to: path.join(__dirname, '/dist'), flatten: false, force: true },
    ]),
  ],
  devServer: {
    stats: 'minimal',
    overlay: true,
    contentBase: path.resolve('src/assets'),
    // contentBase: path.join(__dirname, '/src/assets'),
  }
}
