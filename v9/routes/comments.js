var express = require("express");
var router  = express.Router({mergeParams: true});
var Quote = require("../models/quotes");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var passport = require("passport");

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup quote using ID
   Quote.findById(req.params.id, function(err,quote){
       if(err){
           console.log(err);
           res.redirect("/quotes");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
                req.flash("error", "Your comment wasn't posted");
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

 // COMMENT DESTROY ROUTE
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     //findByIdAndRemove
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Your comment wasn't deleted");
            res.redirect("back");
        } else {
            req.flash("success", "Your comment has been succesfully deleted");
            res.redirect("/quotes/" + req.params.id);
        }
     });
 });
 


module.exports = router;