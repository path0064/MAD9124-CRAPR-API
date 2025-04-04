const passport = require('passport');
const {Strategy : GoogleStrategy} = require('passport-google-oauth20');
const User = require('../models/userSchema');

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI} = process.env;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_REDIRECT_URI,
        },

        async (_req, _accessToken, profile, done) => {
            try{
                let user = await User.findOne({googleId: profile.id});

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        googleId: profile.id,
                    })
                }

            return done(null, user);
            } catch (error) {
                return done(error);
            }
        }

    )
)

