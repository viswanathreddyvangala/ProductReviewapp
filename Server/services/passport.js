const passport = require('passport')
const keys= require('../config/keys')
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const mongoose  = require('mongoose')
const User = mongoose.model('users')

passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID:     keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true,
    proxy : true
  },
   (request, accessToken, refreshToken, profile, done) => {
    console.log("profile",profile.id)
    User.findOne({'googleId':profile.id}).then(existinguser => {
      if(existinguser){
           console.log("User already exists")
           done(null,existinguser)
      }else{
        new User({ 'googleId': profile.id })
        .save()
        .then(user => done(null,user));
      }
    })
     
  }
));