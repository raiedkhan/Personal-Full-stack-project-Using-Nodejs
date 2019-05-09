var express           =require("express"),
        app           =express(),
        bodyParser    =require("body-parser"),
        mongoose      =require("mongoose"),
        passport      = require("passport"),
        LocalStrategy = require("passport-local"),
        Quote         = require("./models/quotes"),
        User          = require("./models/user"),
        seedDB        =require("./seeds")


//APP CONFIG
mongoose.connect("mongodb://localhost/randomquote",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



//MONGOOSE/MODEL CONFIG 

//Passport config
app.use(require("express-session")({
    secret: "Raied is best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

//Show all Quotes

app.get("/quotes",function(req,res)
{
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("index",{quotes:quotes,currentUser:req.user});
        }
    });
});

//Add Quotes

app.get("/quotes/new",isLoggedIn,function(req,res){
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("new",{quotes:quotes});
        }
    });
});

//Create Quote
app.post("/quotes",isLoggedIn,function(req,res)
{
    Quote.create(req.body.quote,function(err,newQuote)
    {
        if(err)
        {
            res.render("new");
        }
        else{
            res.redirect("/quotes");
        }
    });
});

app.get("/",function(req,res)
{
    res.redirect("/quotes");
});




//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
    res.render("register"); 
 });

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({firstname:req.body.firstname,lastname:req.body.lastname,username: req.body.username});
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
app.get("/login", function(req, res){
    res.render("login"); 
 });

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/quotes",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/quotes");
 });
 
 function isLoggedIn(req, res, next){ 
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

app.get("*",function(req,res)
{
    res.send("Page-Not-Found");
});
app.listen(3000,function()
{
    console.log("Random quote app started");
});
