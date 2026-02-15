const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
const isProd = argv.mode === "production";

    return {
        entry: "./src/js/main.js",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: isProd ? "js/[name].[contenthash].js" : "js/[name].js",
            assetModuleFilename: "assets/[hash][ext][query]",
            publicPath: "/"
        },
        devtool: isProd ? "source-map" : "eval-source-map",
        devServer: {
            static: {
            directory: path.join(__dirname, "dist")
            },
            compress: true,
            port: 5173,
            hot: true,
            open: true
        },
        module: {
            rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                "css-loader",
                "postcss-loader",
                "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: "asset/resource"
            }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
            }),
            ...(isProd
            ? [
                new MiniCssExtractPlugin({
                    filename: "css/[name].[contenthash].css"
                })
                ]
            : [])
        ],
        resolve: {
            extensions: [".js"]
        }
    };
};