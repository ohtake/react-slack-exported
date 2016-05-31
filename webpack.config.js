var webpack = require('webpack');

module.exports = {
    entry: ["./app.js"],
    output: {
        filename: "./build.js",
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify("production"),
            },
        }),
    ],
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint',
            },
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                },
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
        ],
    },
};
