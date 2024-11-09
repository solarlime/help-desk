import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
import common from './webpack.common.js';

export default merge(common, {
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
});
