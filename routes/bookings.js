const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');
const _ = require('lodash');
const Booking = require('../models/booking');

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
    Booking.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such booking.` });
        });
});

// READ (ALL)
router.get('/', (req, res) => {
    let query = req.query;
    if (!(query && Object.keys(query).length === 0 && query.constructor === Object)) {
        const { fields, ...rest } = query;
        const fieldList = fields ? fields.split(',') : []
        const updatedQuery = _.mapValues(rest, (value) => {
            return { $regex: new RegExp("^" + value.toLowerCase(), "i") }
        })
        Booking.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedBookingList = _.reduce(result, (bookingList, value, key) => {
                        let bookingObject = _.pick(value, fieldList);
                        return bookingList.concat(bookingObject)
                    }, []);
                    res.json(modifiedBookingList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such Booking.` });
            });
    }
    else {
        Booking.find({})
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            });
    }
});

// CREATE
router.post('/', postLimiter, (req, res) => {

    let newBooking = new Booking({
        studentId: req.body.studentId,
        date: req.body.date,
        bookingType: req.body.bookingType,
        time: req.body.time,
        bookingStatus: req.body.bookingStatus
    });

    newBooking.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    studentId: result.studentId,
                    date: result.date,
                    bookingType: result.bookingType,
                    time: result.time,
                    bookingStatus: result.bookingStatus
                }
            });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.studentId) {
                    res.status(400).json({ success: false, msg: err.errors.studentId.message });
                    return;
                }
                if (err.errors.date) {
                    res.status(400).json({ success: false, msg: err.errors.date.message });
                    return;
                }
                if (err.errors.bookingType) {
                    res.status(400).json({ success: false, msg: err.errors.bookingType.message });
                    return;
                }
                if (err.errors.time) {
                    res.status(400).json({ success: false, msg: err.errors.time.message });
                    return;
                }
                if (err.errors.bookingStatus) {
                    res.status(400).json({ success: false, msg: err.errors.bookingStatus.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// UPDATE
router.put('/:id', (req, res) => {

    let updatedBooking = {
        studentId: req.body.studentId,
        date: req.body.date,
        bookingType: req.body.bookingType,
        time: req.body.time,
        bookingStatus: req.body.bookingStatus
    };

    Booking.findOneAndUpdate({ _id: req.params.id }, updatedBooking, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            Booking.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            studentId: newResult.studentId,
                            date: newResult.date,
                            bookingType: newResult.bookingType,
                            time: newResult.time,
                            bookingStatus: newResult.bookingStatus
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
                if (err.errors.studentId) {
                    res.status(400).json({ success: false, msg: err.errors.studentId.message });
                    return;
                }
                if (err.errors.date) {
                    res.status(400).json({ success: false, msg: err.errors.date.message });
                    return;
                }
                if (err.errors.bookingType) {
                    res.status(400).json({ success: false, msg: err.errors.bookingType.message });
                    return;
                }
                if (err.errors.time) {
                    res.status(400).json({ success: false, msg: err.errors.time.message });
                    return;
                }
                if (err.errors.bookingStatus) {
                    res.status(400).json({ success: false, msg: err.errors.bookingStatus.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// DELETE
router.delete('/:id', (req, res) => {

    Booking.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    studentId: result.studentId,
                    date: result.date,
                    bookingType: result.bookingType,
                    time: result.time,
                    bookingStatus: result.bookingStatus
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;
