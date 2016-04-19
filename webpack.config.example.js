var webpack = require('webpack');

var webpackConfig = {
  module: {
    loaders: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0'],
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: []
};

if('production' === process.env.NODE_ENV){
  // replace 'NODE_ENV' variable in the code with 'production'.
  // This will be use for dead code elimination in the minification step below.
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    })
  );
  // Uglify - minify and remove comments for production
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      mangle: true,
    })
  );
}

module.exports = webpackConfig;