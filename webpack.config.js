const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',
  devtool: false,

  entry: {
    content: './content.js',
    settings: './settings/script.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (pathData) => {
      if (pathData.chunk.name === 'settings') {
        return 'settings/script.js';
      }
      return '[name].js';
    },
    clean: true
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' },
        { from: 'mappings.yml', to: '.' },
        { from: 'background.js', to: '.' },
        { from: 'themes', to: 'themes' },
        { from: 'src', to: 'src' },
        { from: 'settings', to: 'settings' },
        { from: 'assets', to: 'assets' },
      ]
    }),
  ],

  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      "path": false,
      "fs": false
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  optimization: {
    minimize: argv.mode === 'production'
  },

  watch: argv.mode === 'development'
});