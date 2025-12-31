const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req,res,next) =>{
  let id  = req.params.id;
  const data = await Listing.findById(id).populate("owner");
  if ( req.user && !data.owner._id.equals(req.user._id)) {
    req.flash("error", "You cant Edit/Delete this post");
    return res.redirect("/listings");
  }
  next();
}

module.exports.isReviewAuthor = async (req,res,next) =>{
  let { id , reviewId } = req.params;
  const data = await Review.findById(reviewId).populate("author");
  if ( req.user && !data.author._id.equals(req.user._id)) {
    req.flash("error", "You cant Delete this Review");
    return res.redirect(`/listings/${id}`);
  }
}