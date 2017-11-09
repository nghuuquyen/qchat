const _ = require('lodash');

/**
* Initialize global configuration
*/
var initGlobalConfig = function () {
  console.log('NODE_ENV : ' + process.env.NODE_ENV);

  if(!process.env.NODE_ENV) {
    console.log('Doing Set Default NODE_ENV = development');
    process.env.NODE_ENV = 'development';
  }

  // Get the default assets
  const defaultAssets = require('./assets/default'));

  // Get the current assets
  const environmentAssets = require('./assets');

  const assets = _.assign({} , defaultAssets, environmentAssets);

  // Get the default config
  const defaultConfig = require('./env/default');

  // Get the current config
  const environmentConfig = require('./env');
  
  // Merge config files
  let config = _.merge(defaultConfig, environmentConfig);

  // Set assets files
  config.assets = assets;

  return config;
};

/**
* Set configuration object
*/
module.exports = initGlobalConfig();
