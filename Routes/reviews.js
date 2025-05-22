const { model } = require("mongoose");
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn,isReviewAuthor,validateReview } = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


//Adding Review To DB
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.newReview));

//Delete Review From DM and Parent Array
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;