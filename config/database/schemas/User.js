'use strict';

var Mongoose 	= require('mongoose');

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";

/**
* Every user has a username, password, socialId, and a picture.
* If the user registered via username and password(i.e. LocalStrategy),
*      then socialId should be null.
* If the user registered via social authenticaton,
*      then password should be null, and socialId should be assigned to a value.
* 2. Hash user's password
*
*/
var UserSchema = new Mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String, default: null },
  socialId: { type: String, default: null },
  picture:  { type: String, default:  DEFAULT_USER_PICTURE}
});

/**
* Before save a user document, Make sure:
* 1. User's picture is assigned, if not, assign it to default one.
* 2. Hash user's password
*
*/
UserSchema.pre('save', function(next) {
  var user = this;

  // ensure user picture is set
  if(!user.picture){
    user.picture = DEFAULT_USER_PICTURE;
  }

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  next();
});

/**
* Create an Instance method to validate user's password
* This method will be used to compare the given password with the passwoed stored in the database
*
*/
UserSchema.methods.validatePassword = function(password, callback) {
  let isMatch = password === this.password;

  if (!isMatch) {
    return callback(new Error('Password not match.'));
  }

  callback(null, isMatch);
};

module.exports = Mongoose.model('User', UserSchema);
