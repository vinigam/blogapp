const express = require('express')

const routes = express.Router()

const mongoose = require('mongoose')

require('../models/user')

const User = mongoose.model("users")

const bcryptjs = require('bcryptjs')

const passport = require('passport')


routes.get('/register', (req, res) =>{
    res.render('user/register')
})

routes.post('/register', (req, res) =>{
    var errors = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: "invalid name"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: "invalid email"})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({text: "invalid password"})
    }

    if(req.body.password.length < 4){
        errors.push({text:"small password"})
    }

    if(req.body.password != req.body.password2){
        errors.push({text: "Diferent passwords, try again"})
    }

    if(errors.length > 0){
        res.render("user/register", {errors: errors})
    }else{
        User.findOne({email: req.body.email}).then((user) =>{
            if(user){
                req.flash("error_msg", "email already registed")
                res.redirect("/user/register")
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcryptjs.genSalt(10, (erro, salt) =>{
                    bcryptjs.hash(newUser.password, salt, (erro, hash) =>{
                        if(erro){
                            req.flash("error_msg", "error saving user")
                            res.redirect("/")
                        }else{
                            newUser.password = hash
                            
                            newUser.save().then(()=>{
                                req.flash("success_msg","account created")
                                res.redirect("/")
                            }).catch((err) =>{
                                req.flash("error_msg", "failed to register user, try again")
                                res.redirect("/user/register")
                            })
                        }
                    })
                })
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_msg", "internal error")
            res.redirect("/")
        })
    }
})

routes.get("/login", (req, res) =>{
    res.render("user/login")
})

routes.post("/login", (req, res, next) =>{
    passport.authenticate("local", {
        successRedirect: "/", 
        failureRedirect: "/user/login", 
        failureFlash: true
    })(req, res, next)
})

routes.get("/logout", (req, res) =>{
    req.logout()
    req.flash("success_msg","Exit")
    res.redirect("/")
})

module.exports = routes