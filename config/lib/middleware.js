/**
* Module dependencies.
*/
const config = require('../config');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const compress = require('compression');

/**
* @name initCoreMiddleware
* @description
* Setup some core middleware if very important for application.
*
* @param  {object} app express instance
* @param  {object} db  mongoose instance
*/
function initCoreMiddleware(app, db) {
  // For compress assets file. Need for improve page load speed.
  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return true;
    },
    level: 9,
    memLevel : 9 // Memory allow to compress, 9 is maximum.
  }));

  // Initialize favicon middleware
  // @TODO: Setup favicon when we have icon.
  // app.use(favicon(config.favicon));

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Setup bodyParser for Passing row data to json.
  app.use(bodyParser.json());

  // Add headers
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });
}

/**
* @name initHelmetHeaders
* @description
* Setup helmet for security headers, it needed for application.
*
* @param  {object} app express instance
* @param  {object} db  mongoose instance
*/
function initHelmetHeaders(app, db) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));

  // Please alway do it.
  app.disable('x-powered-by');
}


module.exports = function setup(app, db) {
  initCoreMiddleware(app, db);

  // For header security configs
  initHelmetHeaders(app, db);
};
