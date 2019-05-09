var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Quote = require("../models/quotes");


router.get("/",function(req,res)
{
    res.redirect("/quotes");
});

// show register form
router.get("/register", function(req, res){
    res.render("register"); 
 });

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/quotes"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login"); 
 });

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/quotes",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/quotes");
 });


// USER PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      Quote.find().where('author.id').equals(foundUser._id).exec(function(err, quotes) {
        if(err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("/");
        }
        res.render("users/showuser", {user: foundUser, quotes: quotes});
      })
    });
  });

 
 function isLoggedIn(req, res, next){ 
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

module.exports = router;