
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
        required: [true, 'Title is required.'],
        validate: titleValidator
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required.'],
    },
    isCoop: {
        type: String,
        required: [true, 'Please provide an option.'],
    },
    admissionsLink: {
        type: String,
        required: [true, 'Program link is required.'],
    }
});

// Use the unique validator plugin
ProgramSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Program = module.exports = mongoose.model('program', ProgramSchema);