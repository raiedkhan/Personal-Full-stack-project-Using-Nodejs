var express = require("express");
var router  = express.Router({mergeParams: true});
var Quote = require("../models/quotes");
var Comment = require("../models/comment");
var passport = require("passport");

//Comments Create
router.post("/",isLoggedIn,function(req, res){
   //lookup quote using ID
   Quote.findById(req.params.id, function(err,quote){
       if(err){
           console.log(err);
           res.redirect("/quotes");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.author.firstname = req.user.firstname;
               comment.author.lastname = req.user.lastname;
               //save comment
               comment.save();
               quote.comments.push(comment);
               quote.save();
               res.redirect('/quotes/' + quote._id);
           }
        });
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