const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    entry: {
        app: './src/index.ts',
        style: './src/style.scss'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Prision Escape',
            minify: true
        }),
        new CheckerPlugin()
    ],
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [{
            type: 'javascript/auto',
            test: /\.(json|html)/,
            exclude: /node_modules/,
            use: ['file-loader'],
        },
        {
            test: /\.ts(x?)$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|svg|jpg|gif|tmx)$/,
            use: ['file-loader']
        }, {
            test: /\.scss$/,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
        }]
    }
};