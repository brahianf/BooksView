const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

// Exportar modulo en CommonJs
module.exports = {
    entry :{
        index: path.resolve(__dirname,'src/js/index.js'),
    },
    mode: 'development',
    output: {
        // return absoluto de la ruta, dirname seteada segun entorno de directorio donde corre
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    devServer: {
        hot: true,
        // open:true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                // Babel loader interpreta archvos Js y los pasa al core de Babel
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                //Archivo que termine en .css va a ser interpretado por expresion regular
                test:/\.css$/,
                use: [
                    'style-loader',
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
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'webpack-dev-server',
            template: path.resolve(__dirname,'index.html')
        }),
    ]
}