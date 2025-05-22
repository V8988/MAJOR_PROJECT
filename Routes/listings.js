const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,validateListing,isOwner} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('image'),wrapAsync(listingController.newListing)); 

router.get('/new',isLoggedIn,listingController.new); 

router.route("/:id")
.put(isLoggedIn,isOwner,upload.single('image'),validateListing,wrapAsync(listingController.updatedListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete))
.get(wrapAsync(listingController.show));


//Listings Edit From
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.edit));


module.exports = router;