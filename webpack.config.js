  const path = require("path");
  const WebpackWebExt = require('webpack-webext-plugin');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                }
            }
        },
    ],
  },
  entry: {
    popup: "./src/popup/app.js",
    background: './src/popup/background.js',
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
        hash: true,
        title: 'My Awesome application',
        template: './src/popup/app.html',
        chunks: ['popup'],
        filename: './popup/app.html',
    }),
    new CopyWebpackPlugin([
        {from:'./src/imgs',to:'./imgs'},
        {from:'./src/manifest.json',to:'./manifest.json'},
        {from:'./src/popup/style.css',to:'./popup/style.css'},
    ]), 
  ]
  };