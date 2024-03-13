
const cities = require('./cities')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [{
                url: 'https://res.cloudinary.com/dqe7balaq/image/upload/v1707364261/YelpCamp/ghacj9itsw0t2dgzg3cj.jpg',
                filename: 'YelpCamp/ghacj9itsw0t2dgzg3cj',

            },
            {
                url: 'https://res.cloudinary.com/dqe7balaq/image/upload/v1707364261/YelpCamp/pb0i54v8hjgpxoew8mum.webp',
                filename: 'YelpCamp/pb0i54v8hjgpxoew8mum',

            },
            {
                url: 'https://res.cloudinary.com/dqe7balaq/image/upload/v1707364261/YelpCamp/ty0aheoetacqttdc43p9.jpg',
                filename: 'YelpCamp/ty0aheoetacqttdc43p9',

            },
            {
                url: 'https://res.cloudinary.com/dqe7balaq/image/upload/v1707364261/YelpCamp/avvl7py2aj8m8kxhej2p.avif',
                filename: 'YelpCamp/avvl7py2aj8m8kxhej2p',

            }],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium quis porro, quod nobis, aperiam eos atque voluptates alias, omnis doloribus iusto architecto asperiores id? Atque exercitationem ipsa architecto earum voluptatum.",
            price: price,
            author: '65bfab5b29c3df3299d2a058',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },

        })
        await camp.save();
    }

    Campground.find({}).then(data => console.log(data));
    // mongoose.disconnect();
}
seedDb();