var express            =require("express"),
        app            =express(),
        bodyParser     =require("body-parser"),
        mongoose       =require("mongoose"),
        flash          = require("connect-flash"),
        passport       = require("passport"),
        LocalStrategy  = require("passport-local"),
        methodOverride = require("method-override"),
        Quote          = require("./models/quotes"),
        Comment        = require("./models/comment"),
        User           = require("./models/user")

//requring routes
var quoteRoutes      = require("./routes/quotes"),
    indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comments")


var url = process.env.DATABASEURL || "mongodb://localhost/randomquote";
mongoose.connect(url,{ useNewUrlParser: true });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});