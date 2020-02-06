const path  = require('path')
const webpackNodeExternals = require('webpack-node-externals')

const serverConfig = {
  // Inform webpack that we're building a bundle
  // for nodeJS, rather  than for the browser
  target: 'node',

  // Tell webpack about the root file of our
  // server application
  entry: './index.js',

  // Tell webpack where to put the output file
  // that is generated
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-react',
            ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } } ]
          ]
        }
      }
    ]
  },

  externals: [
    webpackNodeExternals() //anything in node_modules folder will not be included in the server webpack bundle
  ]

}

module.exports = serverConfig
