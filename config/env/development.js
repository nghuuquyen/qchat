"use strict";

module.exports = {
  db: {
    // mongodb://[username:password@]host1[:port1]
    uri: 'mongodb://127.0.0.1:27017/qchat-dev-db',
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
  sessionSecret: "5901267121262132123123954asd671631",
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
    host: "127.0.0.1",
    port: 6379,
    password: ""
  }
};
