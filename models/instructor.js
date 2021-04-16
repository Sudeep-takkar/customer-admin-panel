const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
// name	department	position	campus	contact	extension	email
const InstructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    department: {
        type: String,
        required: [true, 'Department is required.']
    },
    position: {
        type: String,
        required: [true, 'Designation is required.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
    },
    campus: {
        type: String,
        required: false
    },
    contact: {
        type: String,
        required: false
    },
    extension: {
        type: String,
        required: false
    }
});

// Use the unique validator plugin
InstructorSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Instructor = module.exports = mongoose.model('instructor', InstructorSchema);