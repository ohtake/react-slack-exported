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
  resolve: {
    extensions: ['.js', '.jsx'],
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
        sourceMap: true,
      }),
      new webpack.LoaderOptionsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ] : []),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.jsx$/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015'],
            plugins: [
              ...(isProduction ? [
                'transform-react-remove-prop-types',
              ] : []),
            ],
          },
        },
      },
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      },
      {
        // Required to build moment-timezone
        test: /\.json$/,
        use: {
          loader: 'json-loader',
        },
      },
    ],
  },
};
