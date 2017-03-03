'use strict';

var webpack = require('webpack');
var Extract = require('extract-text-webpack-plugin');


module.exports = {
  entry: './app/app.js',
  output: {
    path         : './public/assets',
    filename     : 'app.js',
  },

  watch: true,

  plugins: [
    new Extract('app.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'warnings'     : false,
        'drop_debugger': true,
        'drop_console' : true,
        'pure_funcs'   : ['console.log']
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015'
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
        loader: 'file?=name[path][name].[ext]'
      }
    ]
  }
}
