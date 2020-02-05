if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI : "mongodb+srv://blogappadmin:blogappadmin@cluster0-qfrmn.mongodb.net/test?retryWrites=true&w=majority"
    }
}else{
    module.exports = {
        mongoURI : "mongodb://localhost/blogapp"
    }
}

//Detect running place and define how database use
