var express = require("express");
var router  = express.Router();
var Quote = require("../models/quotes");
var passport = require("passport");

//Show all Quotes

router.get("/",function(req,res)
{
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("quotes/index",{quotes:quotes,currentUser:req.user});
        }
    });
});

//Add Quotes

router.get("/new",isLoggedIn,function(req,res){
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("quotes/new",{quotes:quotes});
        }
    });
});



//Create Quote
router.post("/",isLoggedIn,function(req,res)
{
    var title = req.body.title;
    var body = req.body.body;
    var author = {
        id: req.user._id,
        username: req.user.username,
        firstname:req.user.firstname,
        lastname:req.user.lastname
    }
    var newQuote = {title:title, body:body, author:author}
    Quote.create(newQuote,function(err,newlyCreated)
    {
        if(err)
        {
            res.render("quotes/new");
        }
        else{
            res.redirect("/quotes");
        }
    });
});


function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;