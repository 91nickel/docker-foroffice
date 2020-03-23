var path = require('path');
var webpack = require('webpack');

var production = process.env.NODE_ENV == 'production';
var development = process.env.NODE_ENV == 'development';

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: files_list,
    output:{
       filename: '[name].min.js' 
    },
    module: {
        rules: [{
            test: /\.css/,
            use: ['css-loader?minimize=true']
        }]
    },
    plugins: []
}