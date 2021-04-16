const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');
const _ = require('lodash');
const Student = require('../models/student');

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
    Student.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such student.` });
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
        Student.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedStudentList = _.reduce(result, (studentList, value, key) => {
                        let studentObject = _.pick(value, fieldList);
                        return studentList.concat(studentObject)
                    }, []);
                    res.json(modifiedStudentList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such Student.` });
            });
    }
    else {
        Student.find({})
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

    // Validate the age
    let age = sanitizeAge(req.body.age);
    if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
    else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

    let newStudent = new Student({
        name: sanitizeName(req.body.name),
        email: sanitizeEmail(req.body.email),
        age: sanitizeAge(req.body.age),
        program: req.body.program
    });

    newStudent.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    age: result.age,
                    program: result.program
                }
            });
        })
        .catch((err) => {
            if (err.errors) {
                if (err.errors.name) {
                    res.status(400).json({ success: false, msg: err.errors.name.message });
                    return;
                }
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                if (err.errors.age) {
                    res.status(400).json({ success: false, msg: err.errors.age.message });
                    return;
                }
                if (err.errors.program) {
                    res.status(400).json({ success: false, msg: err.errors.program.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// UPDATE
router.put('/:id', (req, res) => {

    // Validate the age
    let age = sanitizeAge(req.body.age);
    if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
    else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

    let updatedStudent = {
        name: sanitizeName(req.body.name),
        email: sanitizeEmail(req.body.email),
        age: sanitizeAge(req.body.age),
        program: req.body.program
    };

    Student.findOneAndUpdate({ _id: req.params.id }, updatedStudent, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            Student.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            name: newResult.name,
                            email: newResult.email,
                            age: newResult.age,
                            program: newResult.program
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
                if (err.errors.email) {
                    res.status(400).json({ success: false, msg: err.errors.email.message });
                    return;
                }
                if (err.errors.age) {
                    res.status(400).json({ success: false, msg: err.errors.age.message });
                    return;
                }
                if (err.errors.program) {
                    res.status(400).json({ success: false, msg: err.errors.program.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// DELETE
router.delete('/:id', (req, res) => {

    Student.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    age: result.age,
                    program: result.program
                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;

// Minor sanitizing to be invoked before reaching the database
sanitizeName = (name) => {
    return stringCapitalizeName(name);
}
sanitizeEmail = (email) => {
    return email.toLowerCase();
}
sanitizeAge = (age) => {
    // Return empty if age is non-numeric
    if (isNaN(age) && age != '') return '';
    return (age === '') ? age : parseInt(age);
}
// sanitizeGender = (gender) => {
//     // Return empty if it's neither of the two
//     return (gender === 'm' || gender === 'f') ? gender : '';
// }