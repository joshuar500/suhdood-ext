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
            // TODO: use file-loader for images
            // {
            //     test: /\.html$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: '[path][name].[ext]'
            //         }
            //     }
            // },
            // {
            //     test: /\.(html)$/,
            //     use: {
            //         loader: 'html-loader',
            //         options: {
            //             attrs: [':data-src']
            //         }
            //     }
            // }
        ],
    },
    entry: {
        content_scripts: "./src/content_scripts/friends.js",
        popup: "./src/popup/app.js"
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "[name]/app.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'My Awesome application',
            template: './src/popup/app.html',
            // chunks: ['vendor', 'shared',  'app'],
            filename: './popup/app.html' 
        }),
        // new WebpackWebExt({
        //   runOnce: false,
        //   // this is for development on windows machines
        //   argv: ["/c", "web-ext", "lint", "-s", "lib/"],
        //   webExtPath: "cmd.exe",
        // //   // this is for development on unix machines
        // //   argv: ["run", "-s", "lib/"],
        // //   webExtPath: "web-ext",
        // }),
        // new WebpackWebExt({
        //   runOnce: true,
        //   maxRetries: 3,
        //   // this is for development on windows machines
        //   argv: ["/c", "web-ext", "run", "-s", "lib/"],
        //   webExtPath: "cmd.exe",
        // //   // this is for development on unix machines
        // //   argv: ["run", "-s", "lib/"],
        // //   webExtPath: "web-ext",
        // }),
        new CopyWebpackPlugin([
            {from:'./src/friends/',to:'./friends/'},
            {from:'./src/manifest.json',to:'./manifest.json'},
            {from:'./src/popup/style.css',to:'./popup/style.css'},
        ]), 
      ]
};