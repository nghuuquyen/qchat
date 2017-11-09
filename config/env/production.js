"use strict";

const redisURI = require('url').parse(process.env.REDIS_URL);
const redisPassword = redisURI.auth.split(':')[1];

module.exports = {
  db: {
    // mongodb://[username:password@]host1[:port1]
    uri: 'mongodb://127.0.0.1:27017/qchat-db',
    username: process.env.dbUsername,
    password: process.env.dbPassword,
    host: process.env.dbHost,
    port: process.env.dbPort,
    name: process.env.dbName,
    options: {
      useMongoClient: true
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  sessionSecret: process.env.sessionSecret,
  facebook: {
    clientID: process.env.facebookClientID,
    clientSecret: process.env.facebookClientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos']
  },
  twitter:{
    consumerKey: process.env.twitterConsumerKey,
    consumerSecret: process.env.twitterConsumerSecret,
    callbackURL: "/auth/twitter/callback",
    profileFields: ['id', 'displayName', 'photos']
  },
  redis: {
    host: redisURI.hostname,
    port: redisURI.port,
    password: redisPassword
  }
};
