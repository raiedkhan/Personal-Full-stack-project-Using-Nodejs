var mongoose = require("mongoose");

var quoteSchema=new mongoose.Schema({
    title:String,
    body:String,
    image: String,
    imageId: String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String,
        firstname:String,
        lastname:String
     }
});

module.exports = mongoose.model("Quote", quoteSchema);
