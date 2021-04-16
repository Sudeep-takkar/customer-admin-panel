
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 40],
        message: 'Title must not exceed {ARGS[1]} characters.'
    })
];

// Define the database model
const ProgramSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Program title is required.']
    },
    programCode: {
        type: String,
        required: [true, 'Program code is required.'],
    },
    duration: {
        type: String,
        required: [true, 'Program length is required.'],
    },
    deliveryType: {
        type: String,
        required: [true, 'Program delivery type is required.'],
    },
    programStartDate: {
        type: String,
        required: [true, 'Program start date is required.'],
    },
    isCoop: {
        type: String,
        required: [true, 'Please provide an option.'],
    },
    campus: {
        type: String,
        required: false,
    },
    credentials: {
        type: String,
        required: false,
    },
    admissionsLink: {
        type: String,
        required: [true, 'Program link is required.'],
    },
    department: {
        type: String
    },
    programContact: {
        type: String
    },
    career: {
        type: String
    },
    handbookLink: {
        type: String
    }
});

// Use the unique validator plugin
ProgramSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Program = module.exports = mongoose.model('program', ProgramSchema);