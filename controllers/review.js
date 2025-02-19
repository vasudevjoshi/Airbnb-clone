const review = require('../models/review');
const listings = require('../models/listing');
module.exports.createReview = async (req, res) => {
    let listing = await listings.findById(req.params.id);
    let newReview = new review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;

    await listing.save();
    await newReview.save();
    req.flash("success", " Successfully saved a review");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await listings.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success", " Successfully deleted a review");
    res.redirect(`/listings/${id}`);
};