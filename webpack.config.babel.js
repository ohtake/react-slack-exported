/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import webpack from 'webpack';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/index.jsx',
  ],
  output: {
    publicPath: '/assets/',
    path: path.resolve('assets'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
    ...(isProduction ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
    ] : []),
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.jsx$/,
        include: path.resolve('src'),
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.js$/,
        include: path.resolve('src'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        // Required to build moment-timezone
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};
