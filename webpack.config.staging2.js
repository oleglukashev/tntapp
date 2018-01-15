'use strict';

var webpack = require('webpack');
var path    = require('path');
var Extract = require('extract-text-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  entry: {
    app: './app/app.js',
    vendor: [
      'angular',
      'angular-animate',
      'angular-aria',
      'angular-cookies',
      'angular-messages',
      'angular-resource',
      'angular-sanitize',
      'angular-touch',
      'angular-ui-router',
      'angular-bootstrap-npm',
      'angular-translate',
      'angular-translate-storage-local',
      'angular-translate-storage-cookie',
      'angular-moment',
      'angular-material'
    ]
  },

  output: {
    path: path.join(process.cwd(), 'public', 'assets'),
    filename: '[name].min.js',
  },

  watch: false,

  plugins: [
    new Extract('app.min.css'),
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
      filename : 'vendor.min.js',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://staging2.thenexttable.com/api/v2'),
      FACEBOOK_ID: '722157017888974',
      ENV: JSON.stringify('staging2'),
    }),
    new ngAnnotatePlugin({
      add: true
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
