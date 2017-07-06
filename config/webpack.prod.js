var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('../helpers/root');
var webpack = require('webpack')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

console.info(helpers.root('dist'));
module.exports = webpackMerge(commonConfig, {
  devtool: '#eval',

  output: {
    path: helpers.root('public', 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({ 'process.env': '"production"' }),
    new webpack
      .optimize
      .UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true
      }),
    // extract css into its own file
    new ExtractTextPlugin('[name].css'),
    // Compress extracted CSS. We are using this plugin so that possible duplicated
    // CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching. you can
    // customize output by editing /index.html see
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options: https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
