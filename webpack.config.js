const path = require('path')
const webpack = require('webpack')

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
}