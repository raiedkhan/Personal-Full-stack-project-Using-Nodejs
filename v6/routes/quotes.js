var express = require("express");
var router  = express.Router();
var Quote = require("../models/quotes");
var passport = require("passport");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dogioy5sl', 
  api_key:262468247971273,
  api_secret:'XuvaOiS7gvJ0bE4rDVQJ51DW8kA'
});
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
router.post("/",isLoggedIn, upload.single('image'), function(req, res) 
{
    cloudinary.uploader.upload(req.file.path, function(result) // add cloudinary url for the image to the campground object under image property
    { 
        req.body.quote.image = result.secure_url;// add author to campground
        req.body.quote.imageId = result.public_id;
        req.body.quote.author = {
          id: req.user._id,
          username: req.user.username,
          firstname:req.user.firstname,
          lastname:req.user.lastname
        }
        Quote.create(req.body.quote, function(err, quote) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/quotes');
        });
    });

});



// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Quote.findById(req.params.id).populate("comments").exec(function(err, foundQuote){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("quotes/show", {quote: foundQuote});
        }
    });
})

function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;