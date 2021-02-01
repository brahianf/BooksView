const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const window = require("global/window")

// Exportar modulo en CommonJs
module.exports = {
    entry :{
        // Generate bundle name modules, modulo de modules
        // Lib
        index: path.resolve(__dirname,'src/js/index.js'),
    },
    mode: 'production',
    output: {
        // return absoluto de la ruta, dirname seteada segun entorno de directorio donde corre
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        library: '[name]'
        // En file name se exporta archivo modules.js, library para enlazar de manera global el js con codigo 
    },
    module: {
        rules: [
            {
                test:/\.(js|jsx)$/,
                // Babel loader interpreta archvos Js y los pasa al core de Babel
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test:  /\.html$/,
                use: [
                  {
                    loader: 'html-loader',
                  },
                ],
              },
            {
                //Archivo que termine en .css va a ser interpretado por expresion regular
                test:/\.css$/,
                use: {
                    loader: MiniCssExtractPlugin.loader,
                },
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test:/\.(jpg|png|gif|woff|eot|ttf|svg|mp4|webm)$/,
                use: {
                    // Url-loader covierte archivos a importar en formato base-64
                    loader: 'url-loader',
                    options: {
                        limit: 90000,
                    }
                }
            },
        ]
    },
    resolve :{
        extensions: [".js", ".jsx"]
    },
    // Configuracion ppal de webpack va a tomar referencia Dll
    plugins: [
        new webpack.ProvidePlugin({
            window: 'global/window',
        }),
        new MiniCssExtractPlugin ({
            filename: 'css/[name].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname,'index.html'),
            // filename: path.resolve(__dirname,'index.html'),
        }),
    ],
}