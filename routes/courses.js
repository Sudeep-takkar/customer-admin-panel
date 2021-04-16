const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const Course = require('../models/course');
const _ = require('lodash');

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
    Course.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such course.` });
        });
});

// // READ (ALL)
// router.get('/', (req, res) => {
//     Course.find({})
//         .then((result) => {
//             res.json(result);
//         })
//         .catch((err) => {
//             res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
//         });
// });

router.get('/', (req, res) => {
    let query = req.query;
    if (!(query && Object.keys(query).length === 0 && query.constructor === Object)) {
        const { fields, ...rest } = query;
        const fieldList = fields ? fields.split(',') : []
        const updatedQuery = _.mapValues(rest, (value) => {
            return { $regex: new RegExp("^" + value.toLowerCase(), "i") }
        })
        Course.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedCourseList = _.reduce(result, (courseList, value, key) => {
                        let courseObject = _.pick(value, fieldList)
                        return courseList.concat(courseObject)
                    }, []);
                    res.json(modifiedCourseList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such Course.` });
            });
    }
    else {
        Course.find({})
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

    let newCourse = new Course({
        title: req.body.title,
        courseCode: req.body.courseCode,
        programCode: req.body.programCode,
        hours: req.body.hours,
        credits: req.body.credits,
        coursesPreRequisites: req.body.coursesPreRequisites,
        coursesCoRequisites: req.body.coursesCoRequisites
    });

    newCourse.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    title: result.title,
                    courseCode: result.courseCode,
                    programCode: result.programCode,
                    hours: result.hours,
                    credits: result.credits,
                    coursesPreRequisites: result.coursesPreRequisites,
                    coursesCoRequisites: result.coursesCoRequisites
                }
            });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.title) {
                    res.status(400).json({ success: false, msg: err.errors.title.message });
                    return;
                }
                if (err.errors.courseCode) {
                    res.status(400).json({ success: false, msg: err.errors.courseCode.message });
                    return;
                }
                if (err.errors.programCode) {
                    res.status(400).json({ success: false, msg: err.errors.programCode.message });
                    return;
                }
                if (err.errors.hours) {
                    res.status(400).json({ success: false, msg: err.errors.hours.message });
                    return;
                }
                if (err.errors.credits) {
                    res.status(400).json({ success: false, msg: err.errors.credits.message });
                    return;
                }
                if (err.errors.coursesPreRequisites) {
                    res.status(400).json({ success: false, msg: err.errors.coursesPreRequisites.message });
                    return;
                }
                if (err.errors.coursesCoRequisites) {
                    res.status(400).json({ success: false, msg: err.errors.coursesCoRequisites.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// UPDATE
router.put('/:id', (req, res) => {

    let updatedCourse = {
        title: req.body.title,
        courseCode: req.body.courseCode,
        programCode: req.body.programCode,
        hours: req.body.hours,
        credits: req.body.credits,
        coursesPreRequisites: req.body.coursesPreRequisites,
        coursesCoRequisites: req.body.coursesCoRequisites
    };

    Course.findOneAndUpdate({ _id: req.params.id }, updatedCourse, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            Course.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            title: newResult.title,
                            courseCode: newResult.courseCode,
                            programCode: newResult.programCode,
                            hours: newResult.hours,
                            credits: newResult.credits,
                            coursesPreRequisites: newResult.coursesPreRequisites,
                            coursesCoRequisites: newResult.coursesCoRequisites
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
                if (err.errors.title) {
                    res.status(400).json({ success: false, msg: err.errors.title.message });
                    return;
                }
                if (err.errors.courseCode) {
                    res.status(400).json({ success: false, msg: err.errors.courseCode.message });
                    return;
                }
                if (err.errors.programCode) {
                    res.status(400).json({ success: false, msg: err.errors.programCode.message });
                    return;
                }
                if (err.errors.hours) {
                    res.status(400).json({ success: false, msg: err.errors.hours.message });
                    return;
                }
                if (err.errors.credits) {
                    res.status(400).json({ success: false, msg: err.errors.credits.message });
                    return;
                }
                if (err.errors.coursesPreRequisites) {
                    res.status(400).json({ success: false, msg: err.errors.coursesPreRequisites.message });
                    return;
                }
                if (err.errors.coursesCoRequisites) {
                    res.status(400).json({ success: false, msg: err.errors.coursesCoRequisites.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// DELETE
router.delete('/:id', (req, res) => {

    Course.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    title: result.title,
                    courseCode: result.courseCode,
                    programCode: result.programCode,
                    hours: result.hours,
                    credits: result.credits,
                    coursesPreRequisites: result.coursesPreRequisites,
                    coursesCoRequisites: result.coursesCoRequisites
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;
