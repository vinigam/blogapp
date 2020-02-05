module.exports = {
    isAdmin : function(req, res, next){
        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        }
        req.flash("error_msg","you must be Admin to enter here")
        res.redirect("/")
    }
}

//Only Admin can use specifcs routes