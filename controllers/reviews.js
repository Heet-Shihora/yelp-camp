const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.createReview = async (req, res) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    cg.reviews.push(review);
    await cg.save();
    await review.save();
    req.flash('success', 'Created a new review');
    res.redirect(`/campgrounds/${cg._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    // res.send("deleted");
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
};


