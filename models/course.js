const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

// Define the database model
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required.']
    },
    courseCode: {
        type: String,
        required: [true, 'Course code is required.'],
    },
    programCode: {
        type: String,
        required: [true, 'Program code is required.'],
    },
    hours: {
        type: String,
        required: [true, 'Number of hours field is required.']
    },
    credits: {
        type: String,
        required: [true, 'Course credits field is required.']
    },
    coursesPreRequisites: {
        type: String,
        required: false
    },
    coursesCoRequisites: {
        type: String,
        required: false
    }
});

// Use the unique validator plugin
CourseSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Course = module.exports = mongoose.model('course', CourseSchema);