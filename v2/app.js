var express     =require("express"),
app             =express(),
bodyParser      =require("body-parser"),
mongoose        =require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://localhost/randomquote",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//MONGOOSE/MODEL CONFIG 
var quoteSchema=new mongoose.Schema({
    title:String,
    body:String,
});
var titleSchema=new mongoose.Schema({
    title:String,
});
var Title =mongoose.model("Title",titleSchema);
var Quote =mongoose.model("Quote",quoteSchema);

//Show all Quotes

app.get("/quotes",function(req,res)
{
    Quote.find({},function(err,quotes){
        if(err){
            console.log("Error");
        }
        else{
            res.render("index",{quotes:quotes});
        }
    });
});

//Add Quotes

app.get("/quotes/new",function(req,res){
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
app.post("/quotes",function(req,res)
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

app.get("*",function(req,res)
{
    res.send("Page-Not-Found");
});


app.listen(3000,function()
{
    console.log("Random quote app started");
});
