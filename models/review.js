const mongoose = require('mongoose');
// const { schema } = require('./campground');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

const Review = mongoose.model('review', reviewSchema);
module.exports = Review;