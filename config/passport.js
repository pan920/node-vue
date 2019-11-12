var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';


module.exports = passport => {
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        // console.log(jwt_payload)
        User.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    console.log(user)
                    return done(null, user);
                }

                return done(null,false);
            })
            .catch(err => console.log(err))
        return
        // User.findOne({
        //     id: jwt_payload.sub
        // }, function (err, user) {
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //         // or you could create a new account
        //     }
        // });
    }));
}