const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
//why does 'User' need to be in {}?
const { User } = require("../model/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user.id);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the google strat
      callbackURL: "/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user already exists in our db
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          //already have the user
          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          //if not, create user in our db
          new User({
            username: profile.displayName,
            googleId: profile.id
          })
            .save()
            .then(newUser => {
              console.log("new user created:" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
