var express           =require("express"),
        app           =express(),
        bodyParser    =require("body-parser"),
        mongoose      =require("mongoose"),
        passport      = require("passport"),
        LocalStrategy = require("passport-local"),
        Quote         = require("./models/quotes"),
        User          = require("./models/user"),
        seedDB        =require("./seeds")


//requring routes
var quoteRoutes = require("./routes/quotes"),
    indexRoutes = require("./routes/index")



//APP CONFIG
mongoose.connect("mongodb://localhost/randomquote",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



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

 app.use("/",indexRoutes);
 app.use("/quotes",quoteRoutes);


app.listen(3000,function()
{
    console.log("Random quote app started");
});
