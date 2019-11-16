const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist/"),
        filename: "js/nomadder-client.min.js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
    ],
    module: {
        rules: [{
                test: /\.ts$/,
                loader: [
                    { loader: 'template-string-optimize-loader' },
                    { loader: "awesome-typescript-loader" }
                ]
            }
        ]
    },
    optimization: {
        minimize:true,
        minimizer: [
          new TerserPlugin({
            extractComments: 'all'
          }),
        ],
      },
};