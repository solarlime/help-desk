const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
      }),
      new CSSMinimizerPlugin({
        minify: CSSMinimizerPlugin.cssoMinify,
      }),
    ],
  },
  plugins: [new Dotenv({ systemvars: true })],
});
