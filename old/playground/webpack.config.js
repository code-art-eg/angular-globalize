const path = require('path');
const webpack = require('webpack');

const deployDir = __dirname;
module.exports = {
    entry: {
            'main-client': './main.ts'
    },
    stats: { modules: false },
    context: __dirname,
    resolve: { 
        extensions: ['.ts', '.js'],
        alias: {
            '@code-art/angular-globalize': path.join(deployDir, '../src/module.ts')
        }
    },
    output: {
        path: path.join(deployDir, './'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            { test: /\.ts$/, use: [{
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        noEmit: false
                    }
                }
            }, 'angular2-template-loader']},
            { test: /\.html/, use: 'html-loader?minimize=false' },
            { test: /(^|\/|(\s+))globalize/i, loader: 'imports-loader?define=>false' }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(deployDir, 'vendor-manifest.json'))
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map', // Remove this line if you prefer inline source maps
            moduleFilenameTemplate: path.relative(deployDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
        }),
        // new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './',
        hot: true
    }
};
