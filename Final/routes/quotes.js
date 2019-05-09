var express = require("express");
var router  = express.Router();
var Quote = require("../models/quotes");
var passport = require("passport");
var middleware = require("../middleware");
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
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Quote.find({title: regex},function(err,quotes){
            if(err){
                console.log("Error");
            }
            else{
                if(quotes.length < 1) {
                    noMatch = "OOPS!!! No quotes found, please try again.";
                }
                res.render("quotes/index",{quotes:quotes, noMatch: noMatch,currentUser:req.user});
            }
        });
    }
    else{
        Quote.find({},function(err,quotes){
            if(err){
                console.log("Error");
            }
            else{
                res.render("quotes/index",{quotes:quotes,noMatch: noMatch,currentUser:req.user});
            }
        });
    }

});



//Add Quotes

router.get("/new", middleware.isLoggedIn,function(req,res){
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
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) 
{
    cloudinary.uploader.upload(req.file.path, function(result) // add cloudinary url for the image to the quote object under image property
    { 
        req.body.quote.image = result.secure_url;// add author to quote
        req.body.quote.imageId = result.public_id;
        req.body.quote.author = {
          id: req.user._id,
          username: req.user.username,
          firstname:req.user.firstname,
          lastname:req.user.lastname
        }
        Quote.create(req.body.quote, function(err, quote) {
          if (err) {
            return res.redirect('back');
          }
          req.flash('success','New Quote created');
          res.redirect('/quotes');
        });
    });

});

// SHOW - shows more info about one quote
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Quote.findById(req.params.id).populate("comments").exec(function(err, foundQuote){
        if(err){
            console.log(err);
        } else {
            res.render("quotes/show", {quote: foundQuote});
        }
    });
})


//Edit Quote

router.get("/:id/edit", middleware.checkQuoteOwnership,function(req, res){
    Quote.findById(req.params.id, function(err, foundQuote){
            res.render("quotes/edit", {quote: foundQuote});
    });
});

// Update Quote

router.put("/:id",middleware.checkQuoteOwnership,function(req, res){
    Quote.findByIdAndUpdate(req.params.id, req.body.quote, function(err, updatedQuote){
               if(err){
                    req.flash('error',"Your quote hasn't been updated");
                   res.redirect("/quotes");
               } else {
                   //redirect somewhere(show page)
                   req.flash('success','Your quote has been succesfully updated');
                   res.redirect("/quotes/" + req.params.id);
               }
            });
        });

//Delete route

router.delete("/:id",middleware.checkQuoteOwnership,function(req, res){
    Quote.findByIdAndRemove(req.params.id, function(err){
       if(err){
            req.flash('error',"Your quote hasn't been deleted");
           res.redirect("/quotes");
       } else {
            req.flash('success',"Your quote has been succesfully deleted");
           res.redirect("/quotes");
       }
    });
 });


// router.put("/:id",function(req, res){
//     cloudinary.uploader.upload(req.file.path, function(result) // add cloudinary url for the image to the campground object under image property
//     { 
//     // find and update the correct campground
//     req.body.quote.image = result.secure_url;// add author to campground
//     req.body.quote.imageId = result.public_id;
//     Quote.findByIdAndUpdate(req.params.id, req.body.quote, function(err, updatedQuote){
//        if(err){
//            res.redirect("/quotes");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/quotes/" + req.params.id);
//        }
//     });
// });
// });


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;