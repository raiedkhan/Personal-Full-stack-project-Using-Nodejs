var mongoose = require("mongoose");
var Quote = require("./models/quotes");

var data = [
    {
        title:"Motivation",
        body:"Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time"
    },
    {
        title: "Love", 
        body:"Love myself I do. Not everything, but I love the good as well as the bad. I love my crazy lifestyle, and I lov"
    },
    {
        title: "Random Quote", 
        body:"One day I will win"
    }
]


function seedDB(){
    //Remove all campgrounds
    Quote.remove({}, function(err){
         if(err){
             console.log(err);
         }
         console.log("removed Quotes!");
          //add a few campgrounds
         data.forEach(function(seed){
             Quote.create(seed, function(err, quote){
                 if(err){
                     console.log(err)
                 } else {
                     console.log("added a quote");
                 }
             });
         });
     }); 
 }
 
 module.exports = seedDB;
 