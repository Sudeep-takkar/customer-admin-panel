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
        // name	department	position	campus	contact	extension	email
        name: req.body.name,
        department: req.body.department,
        position: req.body.position,
        campus: req.body.campus,
        contact: req.body.contact,
        extension: req.body.extension,
        email: req.body.email
    });

    newInstructor.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    name: result.name,
                    department: result.department,
                    position: result.position,
                    campus: result.campus,
                    contact: result.contact,
                    extension: result.extension,
                    email: result.email
                }
            });
        })
        .catch((err) => {

            if (err.errors) {
                // name	department	position	campus	contact	extension	email
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.department) {
                    res.status(400).json({ success: false, msg: err.errors.department.message });
                    return;
                }
                if (err.errors.position) {
                    res.status(400).json({ success: false, msg: err.errors.position.message });
                    return;
                }
                if (err.errors.campus) {
                    res.status(400).json({ success: false, msg: err.errors.campus.message });
                    return;
                }
                if (err.errors.contact) {
                    res.status(400).json({ success: false, msg: err.errors.contact.message });
                    return;
                }
                if (err.errors.extension) {
                    res.status(400).json({ success: false, msg: err.errors.extension.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

router.put('/:id', (req, res) => {

    let updatedInstructor = {
        name: req.body.name,
        department: req.body.department,
        position: req.body.position,
        campus: req.body.campus,
        contact: req.body.contact,
        extension: req.body.extension,
        email: req.body.email
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
                            name: newResult.name,
                            department: newResult.department,
                            position: newResult.position,
                            campus: newResult.campus,
                            contact: newResult.contact,
                            extension: newResult.extension,
                            email: newResult.email
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
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.department) {
                    res.status(400).json({ success: false, msg: err.errors.department.message });
                    return;
                }
                if (err.errors.position) {
                    res.status(400).json({ success: false, msg: err.errors.position.message });
                    return;
                }
                if (err.errors.campus) {
                    res.status(400).json({ success: false, msg: err.errors.campus.message });
                    return;
                }
                if (err.errors.contact) {
                    res.status(400).json({ success: false, msg: err.errors.contact.message });
                    return;
                }
                if (err.errors.extension) {
                    res.status(400).json({ success: false, msg: err.errors.extension.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
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
                    name: result.name,
                    department: result.department,
                    position: result.position,
                    campus: result.campus,
                    contact: result.contact,
                    extension: result.extension,
                    email: result.email
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;

