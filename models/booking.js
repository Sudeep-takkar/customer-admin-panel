const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

// Define the database model
const BookingSchema = new mongoose.Schema({
    studentId: {
        type: String
    },
    date: {
        type: String
    },
    bookingType: {
        type: String
    },
    time: {
        type: String
    },
    bookingStatus: {
        type: String
    }
});

// Use the unique validator plugin
BookingSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Booking = module.exports = mongoose.model('booking', BookingSchema);