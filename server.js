require('dotenv').config()

const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");

const config = require('./config/keys');

// Use Node's default promise instead of Mongoose's promise library
mongoose.Promise = global.Promise;

// Connect to the database
mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

let db = mongoose.connection;

db.on('open', () => {
    console.log('Connected to the database.');
});

db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

const app = express();

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize routes middleware
app.use('/api/students', require('./routes/students'));
app.use('/api/users', require('./routes/users'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/courses', require('./routes/courses'));


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({ err: err });
});

if (process.env.NODE_ENV === "production") {

    // Set static folder   
    // All the javascript and css files will be read and served from this folder
    app.use(express.static("react-app/build"));

    // index.html for all page routes    html or routing and naviagtion
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./react-app", "build", "index.html"));
    });
}

// Start the server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
