const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Client = require("../models/client-model.js");
const { Strategy } = require("passport-local");

//sets the user in the session
passport.serializeUser((loggedInUser, cb) => {
  cb(null, { _id: loggedInUser._id, username: loggedInUser.username });
});

// allows access to the user in req.session 
passport.deserializeUser((userIdFromSession, cb) => {
  Client.findById(userIdFromSession, (error, userDocument) => {
    if (error) {
      cb(error);
      return;
    }
    cb(null, userDocument);
  });
});

//passport - local strategy

passport.use(
  new LocalStrategy(
    {
      // fields used in the login form :
      usernameField: "email", //default is username
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const client = await Client.findOne({ email });
        if (!client) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (!bcrypt.compareSync(password, client.passwordHash)) {
          return done(null, false, { message: "Incorrect password." });
        }
        done(null, client);
      } catch (error) {
        done(error);
      }
    }
  )
);


// passport google strategy
passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:"/auth/google/callback"
    },
    async(accessToken, refreshToken, profile,done)=>{
        try {
            const client = await Client.findOne({googleId:profile.id});
            if(client){
                //Authenticate and persist in the session
                return done(null,client)
            }
        } catch (error) {
            done(error)
        }
    try {
        const newClient = await Client.create({
            googleId:profile.id,
            username:profile.displayName
        });
        //Authenticate
        done(null,newClient);
    } catch (error) {
        done(error);
    }
    }
    )
);
