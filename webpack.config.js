var webpack = require('webpack');

module.exports = {
    entry: ["./src/app.jsx"],
    output: {
        publicPath: "assets",
        path: "assets",
        filename: "bundle.js",
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
