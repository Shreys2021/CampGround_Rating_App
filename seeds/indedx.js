const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            authore: '60793924e298a525b897df08',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim nihil quod magnam modi, a fugiat vel consequatur! Quis dicta ab enim, libero corporis exercitationem accusamus repellat sint, atque ducimus dolores.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [{
                url: 'https://res.cloudinary.com/noen/image/upload/v1618898054/YelpCamp/j5viorchdakczhbu2hxh.jpg',
                filename: 'YelpCamp/j5viorchdakczhbu2hxh'
            }
            ]
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close()
})