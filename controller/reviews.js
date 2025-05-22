const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.newReview = async (req,res)=>{
    let {id}= req.params;
    console.log(id);
    let listing = await Listing.findById(id);
    if(listing){
    let newReview = new Review(req.body);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    req.flash("success","Review is addedd successfully");
    res.redirect(`/listings/${id}`);
    }
}

module.exports.destroyReview = async (req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
    res.redirect(`/listings/${id}`);
}