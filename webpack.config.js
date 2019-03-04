const path = require('path');

module.exports = {
  entry: './src/chat version 1/scripts/main.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'src/chat version 1')
  },
  mode: 'development',
  externals: {
    'node-fetch': 'fetch',
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    'isomorphic-fetch': 'fetch',
    '@trust/webcrypto': 'crypto',
    'fs': 'empty'
  }
}
