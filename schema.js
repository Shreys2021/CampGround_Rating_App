const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        price: Joi.number().required().min(0),

        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        title: Joi.string().required()

    }).required(),
    deleteImages: Joi.array()
});