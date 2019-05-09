var express           =require("express"),
        app           =express(),
        bodyParser    =require("body-parser"),
        mongoose      =require("mongoose"),
        flash       = require("connect-flash"),
        passport      = require("passport"),
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override"),
        Quote         = require("./models/quotes"),
        Comment     = require("./models/comment"),
        User          = require("./models/user"),
        seedDB        =require("./seeds")


//requring routes
var quoteRoutes      = require("./routes/quotes"),
    indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comments")



//APP CONFIG
mongoose.connect("mongodb://localhost/randomquote",{ useNewUrlParser: true });


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());


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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

app.use("/",indexRoutes);
app.use("/quotes",quoteRoutes);
app.use("/quotes/:id/comments", commentRoutes);

app.listen(3000,function()
{
    console.log("Random quote app started");
});
