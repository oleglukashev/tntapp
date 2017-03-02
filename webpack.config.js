'use strict';

const webpack = require('webpack')

module.exports = {
  entry: './app/main',
  output: {
    filename: 'build.js'
  },

  watch: true,

  plugins: [
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
        loader: 'style!css!autoprefixer?{browsers:["last 2 version"], cascade:false}!stylus'
      },
      {
        test  : /\.css$/,
        loader: 'style!css!autoprefixer?{browsers:["last 2 version"], cascade:false}'
      }
    ]
  }
}
