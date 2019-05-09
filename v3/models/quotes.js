var mongoose = require("mongoose");

var quoteSchema=new mongoose.Schema({
    title:String,
    body:String
});

module.exports = mongoose.model("Quote", quoteSchema);
