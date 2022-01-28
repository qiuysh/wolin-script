const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VERSION = JSON.stringify(require("./package.json").version); // app version.

const isProd = process.env.NODE_ENV === "production";

module.exports = {

  entry: {
    app: { import: './src/app.tsx', dependOn: 'default-vendors' },
    'default-vendors': ['react', 'react-dom', 'react-redux', 'react-router-dom', 'moment', 'js-cookie'],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts[x]?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          }
        ]
      }
    ]
  },

  plugins: [

    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, './public')
    }], {
      ignore: [
        'json/*.ts',
        'imgs/*',
        'styles/*',
        'fonts/emfont/*',
        'sw.js',
      ],
    }),

    new webpack.DefinePlugin({
      APP: {
        VERSION: VERSION
      }
    }),
  ],

  optimization: {
    usedExports: true,
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      }),
    ],
  },

  resolve: {
    fallback: {
      fs: false,
      module: "empty",
      path: false,
      events: false,
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      "@": path.resolve(__dirname, './src'),
      "public": path.resolve(__dirname, './public'),
    },
  },


  devServer: {
    host: '0.0.0.0',
    port: 3001,
    open: false,
    stats: {
      children: true
    },
    proxy: [
    ]
  },
};