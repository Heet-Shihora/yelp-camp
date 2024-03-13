const Campground = require('./models/campground')

const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./joischemas.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("req.user",req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');

    }
    next();


}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    console.log(req.body)
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }

}
module.exports.validateReview = (req, res, next) => {
    console.log(req.body)
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}