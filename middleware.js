const { Listingschema , ReviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You need to login first to create a new listing !");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.validateListing = (req,res,next)=>{
    let {error} = Listingschema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
module.exports.isOwner=async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currentUser._id.equals(listing.owner._id)){
        req.flash("error","You are not permited!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(review);
    if(!res.locals.currentUser._id.equals(review.author)){
        req.flash("error","You are not the author of the review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = ReviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}