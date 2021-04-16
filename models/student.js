
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 40],
        message: 'Name must not exceed {ARGS[1]} characters.'
    })
];

const emailValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 40],
        message: 'Email must not exceed {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isEmail',
        message: 'Email must be valid.'
    })
];

const ageValidator = [
    // TODO: Make some validations here...
];

const permissionValidator = [
    // TODO: Make some validations here...
];

// Define the database model
const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        validate: nameValidator
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        validate: emailValidator
    },
    programCode: {
        type: String,
        required: false
    },
    studentId: {
        type: String,
        required: false
    },
    isGraduated: {
        type: String,
        required: false
    },
    contactNo: {
        type: String,
        required: false
    },
    feesDue: {
        type: String,
        required: false
    }
});

// Use the unique validator plugin
StudentSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Student = module.exports = mongoose.model('student', StudentSchema);