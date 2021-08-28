const campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const Campground = new campground(req.body.campground);
    Campground.geometry = geoData.body.features[0].geometry;
    Campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    Campground.authore = req.user._id;
    await Campground.save();
    console.log(Campground);
    req.flash('success', 'succesfully made a new flash');
    res.redirect(`/campground/${Campground._id}`);

}

module.exports.showCampground = async (req, res) => {

    const Campground = await campground.findById(req.params.id).populate({
        path: 'reviews', populate: {
            path: 'authore'
        }
    }).populate('authore');
    if (!Campground) {
        req.flash('error', 'Cannot find Campround');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { Campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id)

    if (!Campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect(`/campground`)
    }

    res.render('campgrounds/edit', { Campground })
}

module.exports.updateCampground = async (req, res) => {

    const { id } = req.params;
    console.log(req.body);
    const Campground = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    Campground.images.push(...imgs);
    await Campground.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await Campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'succesfully updated campground');
    res.redirect(`/campground/${Campground._id}`)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campground')
}