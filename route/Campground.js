const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground');
const ExpressError = require('../utilis/expresserror');
const campground = require('../models/campground');
const joi = require('joi');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utilis/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/', catchAsync(campgrounds.index))


router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("HI");
// })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.get('/:id', catchAsync(campgrounds.showCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

module.exports = router;