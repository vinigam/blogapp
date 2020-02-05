const localStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

//User model

require('../models/user')
const user = mongoose.model('users')

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'},(email,password, done)=>{
        user.findOne({email: email}).then((user)=>{
            if(!user){
                return done(null,false, {message:"user not found"})
            }else{
                bcryptjs.compare(password, user.password, (err,check)=>{
                    if(check){
                        return done(null,user)
                    }else{
                        return done(null, false, {message: "Incorrect password"})
                    }

                })
            }
        }).catch()
    }))

    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })
    passport.deserializeUser((id, done) =>{
        user.findById(id,(err, user) =>{
            done(err, user)
        })
    })
}

