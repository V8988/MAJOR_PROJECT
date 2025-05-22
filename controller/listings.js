const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");


module.exports.index= async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listing/index.ejs",{ allListings });
}

module.exports.new =(req,res)=>{
        res.render("./listing/new.ejs");
}

module.exports.newListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body;
    let newListing =new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save().then(()=>{
        req.flash("success","New Listing Is Added..!");
    }).catch(()=>{
        //req.flash("errorMsg",`Listing is not added!`);
        throw new ExpressError(400,"Please Give Valid Information !");
    });
    res.redirect("/listings");
}

module.exports.edit = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing dosn't exist");
        return res.redirect("/listings");
    }
    res.render("./listing/edit.ejs",{ listing });
   
}

module.exports.updatedListing = async (req,res)=>{
    let {id} = req.params;
    let listing = req.body;
    if(listing =={}){
        throw new ExpressError(400,"Please Give Valid Information");
    }
    let update = await Listing.findOneAndUpdate({_id:id},{...listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    update.image = { url,filename };
    await update.save();
    }
    if(update){
         req.flash("success","Listings is updated!");
         res.redirect(`/listings/${id}`);
    }
}

module.exports.delete = async (req,res)=>{
    let {id} =req.params;
    let update = await Listing.findOneAndDelete({_id:id});
    if(update){
        req.flash("success","Listings is sussessfully Deleted..");
    }
    res.redirect("/listings");
}

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author",
    },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing dosen't exist");
        res.redirect("/listings");
    }else{
         res.render("./listing/show.ejs",{ listing,presentUser:req.user });
    }
}