var bcrypt = require("bcryptjs");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

passport.use(
  "login",
  new LocalStrategy(function(username, password, done) {
    db.Login.findOne({ where: { username: username } }).then((user, err) => {
      if (err) {
        return done(null, err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        db.Login.findOne({ where: { username: username } }).then(
          (user, err) => {
            if (err) {
              return done(null, err);
            }

            if (user) {
              return done(null, false);
            } else {
              try {
                const reqObj = req.body;
                const newUser = {
                  firstName: reqObj.firstName,
                  lastName: reqObj.lastName,
                  phone: reqObj.phone,
                  email: reqObj.email,
                  city: reqObj.city
                };
                db.User.create(newUser).then(registeredUser => {
                  const newLogin = {
                    username: reqObj.username,
                    password: reqObj.password,
                    UserId: registeredUser.id
                  };
                  db.Login.create(newLogin)
                    .then(login => {
                      return { registeredUser, login };
                    })
                    .then(user => {
                      return done(null, user);
                    });
                });
              } catch (error) {
                done(error);
              }
            }
          }
        );
      });
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "top_secret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token")
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findOne(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
