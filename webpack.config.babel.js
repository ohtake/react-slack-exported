/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  entry: [
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
            presets: ['@babel/preset-react', ['@babel/preset-env', { useBuiltIns: 'usage' }]],
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
            presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]],
          },
        },
      },
    ],
  },
};
