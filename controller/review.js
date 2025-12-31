const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.reviewCreate = async (req, res) => {
    const { id } = req.params;
    if(!id){
        console.log("no id");
    }
    console.log(id);
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new expressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
  }

module.exports.reviewDelete = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.deleteOne({ _id: reviewId });
    res.redirect(`/listings/${id}`);
    // res.send("Review Deleted");
  }