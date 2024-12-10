const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
    entry: './resources/index.tsx',
    output: {
        path: path.resolve(__dirname, 'public/assets'),  // This is correct
        filename: '_react/js/bundle.[contenthash].js',  // Correct output file structure
        clean: true,
        publicPath: '/',  // Adjust publicPath to match the directory of the compiled JS files
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader // Use this in production
                        : 'style-loader', // Use this in development
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: process.env.NODE_ENV === 'production'
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader',
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: '_react/images/[hash][ext][query]',
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public/assets'),
            publicPath: '/',
        },
        port: 3001,
        hot: true,
        historyApiFallback: true,
        open: true,
        compress: true,
        client: {
            overlay: true,
        },
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin(), // This handles CSS minification
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                default: false,
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                styles: {
                    name: 'styles',
                    test: /\.(css|scss)$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: Infinity,
        maxAssetSize: Infinity,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: true,
        }),
        new MiniCssExtractPlugin({
            filename: '_react/css/[name].[contenthash].css',
            chunkFilename: '_react/css/[id].[contenthash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.APP_KEY': JSON.stringify(process.env.APP_KEY),
            'process.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL),
            'process.env.FRONTEND_URL': JSON.stringify(process.env.FRONTEND_URL),
            'process.env.FRONTEND_URL_2': JSON.stringify(process.env.FRONTEND_URL_2),
            'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-report.html',
        }),
    ],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
