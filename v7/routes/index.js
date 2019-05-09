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
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("register",{quotes:quotes});
        }
    });
 });

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username: req.body.username,
        about:req.body.about
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/quotes");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/quotes"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("login",{quotes:quotes});
        }
    });
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
    req.flash("success", "Logged you out!");
    res.redirect("/quotes");
 });


// USER PROFILE
router.get("/users/:id",isLoggedIn, function(req, res) {
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

  router.get("/newuser",function(req,res)
  {
      res.render("users/show");
  });
 
 function isLoggedIn(req, res, next){ 
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

module.exports = router;