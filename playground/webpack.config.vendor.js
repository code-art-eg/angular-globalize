const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var modules = [
    'reflect-metadata',
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/forms',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    'zone.js',
    'globalize',
    'rxjs/Observable',
    'rxjs/ReplaySubject',
    'rxjs/Subscription',
    'rxjs/observable/combineLatest',
    'rxjs/add/observable/of',
    'es6-promise',
    'es6-shim',
    'event-source-polyfill',
    'bootstrap/dist/css/bootstrap.css',
    'iana-tz-data/iana-tz-data.json',
    'cldr-data/supplemental/likelySubtags.json',
    'cldr-data/supplemental/numberingSystems.json',
    'cldr-data/supplemental/metaZones.json',
    'cldr-data/supplemental/timeData.json',
    'cldr-data/supplemental/weekData.json',
    'cldr-data/supplemental/currencyData.json',
    'cldr-data/supplemental/plurals.json',
    'cldr-data/main/en-GB/ca-gregorian.json',
    'cldr-data/main/en-GB/numbers.json',
    'cldr-data/main/en-GB/currencies.json',
    'cldr-data/main/en-GB/timeZoneNames.json',
    'cldr-data/main/en/ca-gregorian.json',
    'cldr-data/main/en/numbers.json',
    'cldr-data/main/en/currencies.json',
    'cldr-data/main/en/timeZoneNames.json',
    'cldr-data/main/de/ca-gregorian.json',
    'cldr-data/main/de/numbers.json',
    'cldr-data/main/de/currencies.json',
    'cldr-data/main/de/timeZoneNames.json',
    'cldr-data/main/ar-EG/ca-gregorian.json',
    'cldr-data/main/ar-EG/numbers.json',
    'cldr-data/main/ar-EG/currencies.json',
    'cldr-data/main/ar-EG/timeZoneNames.json'
];

const deployDir = __dirname;
const extractCSS = new ExtractTextPlugin('vendor.css');
module.exports = {
    stats: {modules: false},
    resolve: {extensions: ['.js']},
    entry: {
        vendor: modules
    },
    output: {
        path: path.join(deployDir),
        publicPath: '',
        filename: '[name].js',
        library: '[name]_[hash]'
    },
    module: {
        rules: [
            {test: /(^|\/|\\|(\s+))globalize/i, loader: 'imports-loader?define=>false'},
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.css(\?|$)/, use: extractCSS.extract({use: 'css-loader'})},
            {test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000'}
        ]
    },
    plugins: [
        extractCSS,
        new webpack.ContextReplacementPlugin(/@angular\b.*\b(bundles|linker)/, path.join(__dirname, './')), // Workaround for https://github.com/angular/angular/issues/11580
        new webpack.ContextReplacementPlugin(/angular[\\\/]core[\\\/]@angular/, path.join(__dirname, './')), // Workaround for https://github.com/angular/angular/issues/14898
        new webpack.ContextReplacementPlugin(/@angular[\\\/]core[\\\/]esm5/, path.join(__dirname, './')),
        new webpack.IgnorePlugin(/^vertx$/), // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        new webpack.DllPlugin({
            path: path.join(deployDir, '[name]-manifest.json'),
            name: '[name]_[hash]'
        })
    ]
};
