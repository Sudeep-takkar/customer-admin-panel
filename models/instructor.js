
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

const InstructorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
    },
    course: {
        type: String,
        required: [true, 'Course is required.'],
    }
});

// Use the unique validator plugin
InstructorSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Instructor = module.exports = mongoose.model('instructor', InstructorSchema);