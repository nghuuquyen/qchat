'use strict';

const Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;
const RamdomString = require('../helpers/RamdomString');
const hsPassword = require('../helpers/HashSaltPassword');

/**
* Each connection object represents a user connected through a unique socket.
* Each connection object composed of {userId + socketId}. Both of them together are unique.
*
*/
var RoomSchema = new Schema({
  name: {
    type: String, required: true
  },
  code : {
    type: String,
    index: {
      unique: true,
      /**
      * For this to work on a previously indexed field,
      * the index must be dropped & the application restarted.
      */
      sparse: true
    }
  },
  password : {
    type: String,
    required: 'Room password is required'
  },
  salt: {
    type: String
  },
  author : {
    type : Schema.Types.ObjectId,
    required : 'Author is required',
    ref: 'User'
  },
  joinedUsers : [{
    type: Schema.Types.ObjectId,
    ref : 'User',
    default : []
  }],
  pendingUsers : [{
    type: Schema.Types.ObjectId,
    ref : 'User',
    default : []
  }],
  connections: [{
    userId: String,
    socketId: String,
    default : []
  }],
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


/**
* Before save a room document, Make sure:
* 1. Hash user's password with salt
* 2. Gennerate room code.
*/
RoomSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    const passwordData = hsPassword.saltHashPassword(this.password);

    this.salt = passwordData.salt;
    this.password = passwordData.hash;
  }

  this.code = RamdomString(6,'aA#');
  next();
});


/**
* Create instance method for hashing a password
*/
RoomSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return hsPassword.hashPassword(password, this.salt);
  } else {
    return password;
  }
};

/**
* Create instance method for authenticating user
*/
RoomSchema.methods.authenticate = function (password) {
  return this.passsword === this.hashPassword(password);
};

module.exports = Mongoose.model('Room', RoomSchema);
