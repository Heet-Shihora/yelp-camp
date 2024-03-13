
const Campground = require('../models/campground')
const Review = require('../models/review')
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
   
    const cg = new Campground(req.body.campground);
    cg.author = req.user._id;
    cg.geometry = geoData.body.features[0].geometry;
    cg.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await cg.save();
    console.log(cg)
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${cg._id}`);

};

module.exports.showCampground = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author');
    // console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
};

module.exports.updateCampground = async (req, res) => {
    console.log(req.body)
    const id = req.params.id;



    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.image.push(...img);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated a campground');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find a campground');
        return res.redirect('/campgrounds')
    }

    // console.log(campground)
    res.render('campgrounds/edit', { campground })
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect('/campgrounds');
}