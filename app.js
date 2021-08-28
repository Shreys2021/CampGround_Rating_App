if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



console.log(process.env.SECRET)

const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utilis/expresserror');
const methodOverride = require('method-override');


const routeUser = require('./route/user');
const routecampground = require('./route/Campground')
const routereviewc = require('./route/reviews')
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
//const MongoDBStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { contentSecurityPolicy } = require('helmet');

//const MongoDBStore = require("connect-mongo")(session);

const dburl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

//'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

// const store = new MongoDBStore({
//     url: dburl,
//     secret: 'thissholudbesecret',
//     touchAfter: 24 * 60 * 60
// });

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })

const sessionConfig = {
    // store,
    name: 'session',
    secret: 'thissholudbesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 100 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));



// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",


// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/noen/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );




app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/', routeUser)
app.use('/campground', routecampground)
app.use('/campground/:id/reviews', routereviewc)

app.get('/', (req, res) => {
    res.render('home')
})




app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))

})

app.use((err, req, res, next) => {
    const { statuscode = 500 } = err;
    if (!err.message) err.message = 'OH NO SOMETHINF WENT WRONG'
    res.status(statuscode).render('error', { err });

})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on port 3000');
})