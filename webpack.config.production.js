'use strict';

var webpack = require('webpack');
var path    = require('path');
var Extract = require('extract-text-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './app/app.js',
    vendor: [
      'angular',
      'angular-material',
    ]
  },

  output: {
    path: path.join(process.cwd(), 'public', 'assets'),
    publicPath: "/public/assets/",
    filename: '[name].[hash].min.js',
  },

  watch: false,

  plugins: [
    new Extract('app.[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'warnings'     : false,
        'drop_debugger': true,
        'drop_console' : true,
        'pure_funcs'   : ['console.log']
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name     : 'vendor',
      chunks   : ['app'],
      filename : 'vendor.[hash].min.js',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://dashboard.thenexttable.com/api/v2'),
      MOLLIE_CLIENT_ID: JSON.stringify('app_WURzGppruyyJhdcK6rcr4jrH'),
      MOLLIE_REDIRECT_URI: JSON.stringify('https://api.dashboard.thenexttable.com/api/v2/auth/mollie'),
      FACEBOOK_ID: '698477453590264',
      BUCKAROO_URL: JSON.stringify('https://checkout.buckaroo.nl/'),
      ENV: JSON.stringify('production'),
    }),
    new ngAnnotatePlugin({
      add: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.template.html'
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: ['ng-annotate-loader', 'babel-loader?presets[]=es2015'],
        exclude: /node_modules/
      },
      {
        test  : /\.styl$/,
        loader: Extract.extract({ fallback: 'style-loader', use: 'css-loader!autoprefixer-loader?browsers=last 2 version!stylus-loader' })
      },
      {
        test  : /\.css$/,
        loader: Extract.extract({ fallback: 'style-loader', use: 'css-loader!autoprefixer-loader?browsers=last 2 version' })
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: 'file-loader?=name[path][name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  }
}
