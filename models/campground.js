const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const opts = { toJSON: { virtuals: true } };
const imageSchema = new Schema({
    url: String,
    filename: String
});
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    image: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "review"
    }]

}, opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;