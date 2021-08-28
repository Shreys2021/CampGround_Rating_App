const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    authore: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;