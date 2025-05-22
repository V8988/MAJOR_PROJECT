const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
//Listing Schema
let listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },description:{
        type:String
    },image:{
        url:String,
        filename:String,
    },price:{
        type:Number,
        required:true
    },location:{
        type:String,
        required:true
    },country:{
        type:String,
        required:true
    },reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

//Listing Collection

listingSchema.post('findOneAndDelete', async (listing)=>{
    await Review.deleteMany({_id:{$in : listing.reviews}});
});
let Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;