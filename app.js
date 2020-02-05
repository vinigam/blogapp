//Loading modules
const Express = require('express')//
const Handlebars = require('express-handlebars')
const bodyParser = require('body-parser')//
const path = require('path')//
const mongoose = require('mongoose')//
const session = require('express-session')//
const flash = require('connect-flash')//

const app = Express()
const admin = require('./routes/admin')

const posts = require('./models/posts')

const model_post = mongoose.model("Posts")

const category = require('./models/category')
const model_category = mongoose.model("category")

const user = require('./routes/user')

const passport = require("passport")
require("./config/auth")(passport)

const db = require("./config/db")

//Conf
    //Sessao
        
        app.use(session({
            secret: "anything",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    
    //Middleware
        app.use((req, res, next) => {
            //global values, if one request ends in success then success msg will apear, so on....
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")// global var that is used to show errors in html page
            res.locals.user = req.user|| null //store logged user
            next()
        })
    //Body parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    
    //Handlebars
        app.engine('handlebars', Handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb+srv://blogappadmin:blogappadmin@cluster0-qfrmn.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            console.log("Server running")
        }).catch((err)=>{
            console.log(err)
        })

    //Public 
    app.use(Express.static(path.join(__dirname, "public"))) // Tell to express the folder that store all the static archives is the "public", __dirname is the absolute path to the "public" folder
    
//routes
    //call this routes from another folder
    app.use('/admin', admin)
    app.use('/user', user)

    app.get('/', (req, res) =>{
        model_post.find().populate("category").sort().then((posts) =>{
            res.render("index", {posts: posts})
        }).catch((err) =>{
            req.flash("error_msg", "internal error")
            console.log(err)
            res.redirect('/')
        })
        
    })
    app.get('/post/:slug', (req, res) =>{
        model_post.findOne({slug: req.params.slug}).then((post) =>{
            if(post){
                res.render("posts/index", {post: post})
            }else{
                req.flash("error_msg", "post doesnt exists")
                res.redirect("/")
            }
        }).catch((err) =>{
            req.flash("error_msg", "internal error")
            res.redirect("/")
        })
    })

    app.get('/category', (req, res) =>{
        model_category.find().then(((categories) =>{
            res.render("categories/index", {categories: categories})
        })).catch((err) =>{
            console.log(err)
            req.flash("error_msg", "internal error")
            res.redirect("/")
        })
    })

    app.get('/category/:slug', (req, res) =>{
        model_category.findOne({slug: req.params.slug}).then((category) =>{
            if(category){
                model_post.find({category: category._id}).then((posts) =>{
                    res.render("categories/posts", {posts:posts, category: category})
                }).catch((err)=>{
                    req.flash("error_msg", "error to list post")
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg", "category not found")
                res.redirect("/")
            }
        }).catch((err) =>{
            req.flash("error_msg", "internal error")
            res.redirect("/")
        })
    })

//Another
const PORT = process.env.PORT|| 8081
app.listen(PORT, ()=>{
    console.log('Port running')
})