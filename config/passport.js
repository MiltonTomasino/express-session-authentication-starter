const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const pool = require("./database");
const crypto = require("crypto");
const { findUserByUsername, findUserById, validPassword } = require("../lib/passwordUtils");


// Passport strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await findUserByUsername(username);
        if (!user) return done(null, false);

        const isValid = validPassword(password, user.password);
        return isValid ? done(null, user) : done(null, false);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});