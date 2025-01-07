import webpack from 'webpack';
// eslint-disable-next-line import-x/default
import WebpackDevServer from 'webpack-dev-server';
import config from '../../../../webpack.dev.js';

const server = new WebpackDevServer(
  { port: 9090, host: 'localhost' },
  webpack(config),
);
server.startCallback((err) => {
  if (err) {
    return;
  }
  if (process.send) {
    process.send('ok');
  }
});
