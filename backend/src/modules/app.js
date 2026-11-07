const { config } = require('../shared/config/env');

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const { apiLimiter } = require('../shared/middlewares/rate-limit');
const { notFound, errorHandler } = require('../shared/middlewares/error-handler');

const app = express();
const isProd = config.environment === 'production';
const distPath = path.join(__dirname, '..', '..', '..', 'frontend', 'dist');

if(config.trustProxy) app.set('trust proxy', config.trustProxy);

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'style-src': ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/"],
      'script-src': ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/"],
      'connect-src': ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/"],
      'upgrade-insecure-requests': isProd ? [] : null
    }
  }
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(distPath));

app.use('/api', apiLimiter, routes);
app.use('/api', notFound);
app.use((req, res) => { res.sendFile(path.join(distPath, 'index.html')) });
app.use(errorHandler);

module.exports = app;