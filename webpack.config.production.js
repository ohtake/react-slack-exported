var webpack = require('webpack');
var _ = require('lodash');
var base = require('./webpack.config');

var overrides = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify("production"),
            },
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
    ],
};

module.exports = _.merge(base, overrides);
