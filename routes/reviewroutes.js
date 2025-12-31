const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const expressError = require("../util/expressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn ,isReviewAuthor } = require("../util/isLoggedIn.js");
const reviewroutes = require("../controller/review.js")

const validateReview = (req, res, next) => {
  let rslt = reviewSchema.validate(req.body);
  // console.log(rslt);
  if (rslt.error) {
    console.log("validation Error")
    throw new expressError(402, rslt.error.message);
  }
  next();
};

//----------------------------------Review Create----------------------------------
router.post(
  "/",
  validateReview,
  isLoggedIn ,
  wrapAsync(reviewroutes.reviewCreate)
);

//----------------------------------Review Delete----------------------------------
router.delete(
  "/:reviewId",
  isLoggedIn ,
  wrapAsync(reviewroutes.reviewDelete)
);
module.exports = router;