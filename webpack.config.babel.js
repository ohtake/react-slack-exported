import path from 'path';

export default {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/app.jsx',
  ],
  output: {
    publicPath: '/assets/',
    path: path.join(__dirname, 'assets'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.jsx$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
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
