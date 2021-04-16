
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

// Define the database model
const EmploymentSchema = new mongoose.Schema({
    employmentType: {
        type: String
    },
    employerName: {
        type: String,
    },
    designation: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    wage: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    datePosted: {
        type: String,
        required: false
    },
    industry: {
        type: String,
        required: false
    },
    targetPrograms: {
        type: String,
        required: false
    },
    wageType: {
        type: String,
        required: false
    },
    expiryDate: {
        type: String,
        required: false
    }
});

// Use the unique validator plugin
EmploymentSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Employment = module.exports = mongoose.model('employments', EmploymentSchema);