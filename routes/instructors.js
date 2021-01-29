const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const Instructor = require('../models/instructor');

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
    windowMs: minutes * 60 * 1000, // milliseconds
    max: 100, // Limit each IP to 100 requests per windowMs 
    delayMs: 0, // Disable delaying - full speed until the max limit is reached 
    handler: (req, res) => {
        res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
    }
});

// READ (ONE)
router.get('/:id', (req, res) => {
    Instructor.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `Can't find an instructor.` });
        });
});

router.get('/', (req, res) => {
    Instructor.find({})
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        });
});

router.post('/', postLimiter, (req, res) => {

    let newInstructor = new Instructor({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        course: req.body.course
    });

    newInstructor.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    course: result.course
                }
            });
        })
        .catch((err) => {

            if (err.errors) {
                if (err.errors.firstName) {
                    res.status(400).json({ success: false, msg: err.errors.firstName.message });
                    return;
                }
                if (err.errors.lastName) {
                    res.status(400).json({ success: false, msg: err.errors.lastName.message });
                    return;
                }
                if (err.errors.course) {
                    res.status(400).json({ success: false, msg: err.errors.course.message });
                    return;
                }
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

router.put('/:id', (req, res) => {

    let updatedInstructor = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        course: req.body.course
    };

    Instructor.findOneAndUpdate({ _id: req.params.id }, updatedInstructor, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            Instructor.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            firstName: newResult.firstName,
                            lastName: newResult.lastName,
                            course: newResult.course
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
                    return;
                });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.firstName) {
                    res.status(400).json({ success: false, msg: err.errors.firstName.message });
                    return;
                }
                if (err.errors.lastName) {
                    res.status(400).json({ success: false, msg: err.errors.lastName.message });
                    return;
                }
                if (err.errors.course) {
                    res.status(400).json({ success: false, msg: err.errors.course.message });
                    return;
                }
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

router.delete('/:id', (req, res) => {
    Instructor.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    course: result.course
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;

