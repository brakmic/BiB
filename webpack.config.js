// retrieve specialized configs from ./config folder
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.client.prod')({env: 'production' });
    break;
  case 'test':
  case 'testing':
    module.exports = require('./config/webpack.client.test')({ env: 'test' });
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.client.dev')({ env: 'development' });
}
