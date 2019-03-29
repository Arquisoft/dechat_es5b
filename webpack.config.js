const path = require('path');

module.exports = {
  entry: './src/scripts/main.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'src')
  },
  node:
  {
	"child_process": "empty"
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
