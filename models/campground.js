const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

var schemaOptions = {
    toJSON: {
        virtuals: true
    }
};

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
    price: Number,
    description: String,
    location: String,
    authore: {

        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, schemaOptions);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return { url: `/campground/${this._id}`, title: this.title, location: this.location };

    // return ` <a href='/campground/${this._id}'>${this.title}</a>`;
});



module.exports = mongoose.model('campground', CampgroundSchema);