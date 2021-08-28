const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/review')
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const ExpressError = require('../utilis/expresserror');
const campground = require('../models/campground');
const Review = require('../models/review');
const Joi = require('joi');
//const validateReview = require('../middleware');

const catchAsync = require('../utilis/catchAsync');

const validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            body: Joi.string().required()
        }).required()
    })


    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))



router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.deletereviews))


module.exports = router;