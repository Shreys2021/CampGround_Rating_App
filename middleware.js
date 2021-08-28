const ExpressError = require('./utilis/expresserror');
const campground = require('./models/campground');
const Review = require('./models/review');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schema');

// const BaseJoi = require('joi');
// const sanitizeHtml = require('sanitize-html');


// const extension = (joi) => ({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHTML': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHTML: {
//             validate(value, helpers) {
//                 const clean = sanitizeHtml(value, {
//                     allowedTags: [],
//                     allowedAttributes: {},
//                 });
//                 if (clean !== value) return helpers.error('string.escapeHTML', { value })
//                 return clean;
//             }
//         }
//     }
// });

// const Joi = BaseJoi.extend(extension);

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}

//  image: Joi.string().required(),
module.exports.validateCampground = (req, res, next) => {
    campgroundSchema: Joi.object({
        campgrounds: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),

            location: Joi.string().required(),
            description: Joi.string().required()
        }).required(),
        deleteImages: Joi.array(),
    })
    const { error } = campgroundSchema.validate(req.body);
    //  console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);
    if (!Campground.authore.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission');
        return res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, nest) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(id);
    if (!review.authore.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission');
        return res.redirect(`/campground/${id}`)
    }
    next()
}


// module.exports.validateReview = (req, res, next) => {
//     const reviewSchema = Joi.object({
//         review: Joi.object({
//             rating: Joi.number().required().min(1).max(5),
//             body: Joi.string().required()
//         }).required()
//     })
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }
//     else {
//         next();
//     }
// }
