const Express = require('express')
const router = Express.Router()
const mongoose = require('mongoose')

require('../models/posts')
const posts = mongoose.model("Posts")

require("../models/category")
const category = mongoose.model("category")

const {isAdmin} = require("../helpers/isAdmin") // {} this way means that i only need to require the function between {}

router.get('/', isAdmin, (req, res) => {
    res.render("admin/index")
})

router.get('/posts', isAdmin, (Req, res) => {
    posts.find().populate("category").sort({data:"desc"}).then((posts) =>{
         res.render("admin/posts", {posts: posts})
    }).catch((err) =>{
        req.flash("error_msg", "error to render posts")
        res.redirect("/admin")
    })
   
})

router.post('/posts/new', isAdmin, (req, res) => {
    var errors = []
    if(req.body.category =="0"){
        errors.push({text: "Invalid category"})
    }
    if(errors.length > 0){
        res.render("admin/addpost", {errors: errors})
    }else{
        const newpost = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
            slug: req.body.slug
        }
        new posts(newpost).save().then(() =>{
            req.flash("success_msg"," Post created")
            res.redirect("/admin/posts")
        }
        ).catch((err) =>{
            req.flash("error_msg", "Post not created")
            res.redirect("/admin/posts")
        })
    }
})

router.get('/posts/add', isAdmin, (req, res) => {
    category.find().then((categories) =>{
        res.render("admin/addpost", {categories: categories})
    }).catch((err) =>{
        req.flash("error_msg", "error to find post")
        res.redirect("/admin")
    })
    
})

router.get('/categories', isAdmin, (req, res) => {
    category.find().then((category)=>{
        res.render("admin/categories", {category: category})
    }).catch((err) => {
        res.send(err)
    })
   
})

router.get('/categories/add', isAdmin, (req, res) => {
    res.render("admin/addcategories")
})

router.post('/categories/new', isAdmin,(req, res) =>{

    var errors = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: "Invalid name"})
        
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.name == null){
        errors.push({text: "Invalid slug"})
    }
    if(req.body.name.length < 2){
        errors.push({text: "Name is small"})
    }
    
    if(errors.length > 0 ){
        res.render("admin/addcategories", {errors: errors})
    }else{
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        new category(newCategory).save().then(()=>{
            req.flash("success_msg", "category added")
            res.redirect("/admin/categories")
        }).catch((err)=>{
            req.flash("error_msg", "data add failed")
            res.redirect("/admin/categories")
        })
    }
})

router.get('/categories/edit/:id', isAdmin, (req, res) => {

    category.findOne({_id: req.params.id}).then((category) =>{
        res.render('admin/editcategory', {category: category})
    }).catch((err) =>{
        req.flash("error_msg", "Data not exists")
        res.redirect("/admin/categories")
    })
})

router.post('/categories/edit', isAdmin, (req, res) => {

    category.findOne({_id: req.body.id}).then((category)=>{

        var errors = []

        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
            errors.push({text: "Invalid name"})
            
        }
        
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.name == null){
            errors.push({text: "Invalid slug"})
        }
        if(req.body.name.length < 2){
            errors.push({text: "Name is small"})
        }
        
        if(errors.length > 0 ){
            res.render("admin/addcategories", {errors: errors})
        
        }else{
            category.name = req.body.name
            category.slug = req.body.slug
        

            category.save().then(() =>{
                req.flash("success_msg", "Edited with sucess")
                res.redirect("/admin/categories")
            
            }).catch((err) =>{
                req.flash("error_msg", "Save internal error")
            })
        }
    }).catch((err)=>{
        console.log(err)
        req.flash("error_msg", "Error during edition")
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete', isAdmin, (req, res) => {
    category.remove({_id: req.body.id}).then(() =>{
        req.flash("success_msg"," Deleted")
        res.redirect('/admin/categories')
    }).catch((err) =>{
        req.flash("error_msg", "cannot delete")
        res.redirect('/admin/categories')
    })
})

router.get('/posts/edit/:id', isAdmin, (req, res) => {

    posts.findOne({_id: req.params.id}).then((posts) =>{
        category.find().then((category) => {
            res.render('admin/editposts', {category: category, posts: posts})
        }).catch((err) =>{
            req.flash("error_msg", "Data not exists")
        res.redirect("/admin/posts")
        })
        
    }).catch((err) =>{
        req.flash("error_msg", "Data not exists")
        res.redirect("/admin/posts")
    })
})

router.post("/posts/edit", isAdmin, (req, res) =>{
    posts.findOne({_id: req.body.id}).then((posts) =>{
        posts.title = req.body.title,
        posts.slug = req.body.slug,
        posts.description = req.body.description,
        posts.content = req.body.content,
        posts.category = req.body.category
        
        posts.save().then(() =>{
            req.flash("success_msg", "Success Edit")
            res.redirect("/admin/posts")
        }).catch((err) =>{
            console.log("1" + err)
            req.flash("error_msg", "Internal error")
            res.redirect("/admin/posts")
        })
        


    }).catch((err) =>{
        console.log("2" + err)
        req.flash("error_msg", "error to edit")
        res.redirect("/admin/posts")
    })
})

router.get('/posts/delete/:id', isAdmin, (req, res) =>{
    posts.remove({_id: req.params.id}).then(() =>{
        req.flash("success_msg"," Deleted")
        res.redirect("/admin/posts")
    }).catch((err) =>{
        req.flash("error_msg", "internal error")
        console.log(err)
        res.redirect("/admin/posts")
    })    
})
module.exports = router

