const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Program = require('../models/program');

const _ = require('lodash')

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
    Program.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such program.` });
        });
});

// READ (ALL)
router.get('/', (req, res) => {
    let query = req.query;
    if (!(query && Object.keys(query).length === 0 && query.constructor === Object)) {
        const { fields, ...rest } = query;
        const updatedQuery = _.mapValues(rest, (value) => {
            return { $regex: new RegExp("^" + value.toLowerCase(), "i") }
        })
        const fieldList = fields ? fields.split(',') : []
        Program.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedProgramList = _.reduce(result, (progList, value, key) => {
                        const programObject = _.pick(value, fieldList)
                        return progList.concat(programObject)
                    }, []);
                    res.json(modifiedProgramList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such program.` });
            });
    }
    else {
        Program.find({})
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

    // // Validate the age
    // let age = sanitizeAge(req.body.age);
    // if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
    // else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });
    let newProgram = new Program({
        title: sanitizeTitle(req.body.title),
        duration: req.body.duration,
        programCode: req.body.programCode,
        deliveryType: req.body.deliveryType,
        isCoop: req.body.isCoop,
        admissionsLink: req.body.admissionsLink,
        programStartDate: req.body.programStartDate,
        campus: req.body.campus,
        credentials: req.body.credentials,
        department: req.body.department,
        programContact: req.body.programContact,
        career: req.body.career,
        handbookLink: req.body.handbookLink
    });

    newProgram.save()
        .then((result) => {
            res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                    _id: result._id,
                    title: result.title,
                    duration: result.duration,
                    programCode: result.programCode,
                    deliveryType: result.deliveryType,
                    isCoop: result.isCoop,
                    admissionsLink: result.admissionsLink,
                    programStartDate: result.programStartDate,
                    campus: result.campus,
                    credentials: result.credentials,
                    department: result.department,
                    programContact: result.programContact,
                    career: result.career,
                    handbookLink: result.handbookLink
                }
            });
        })
        .catch((err) => {

            if (err.errors) {
                if (err.errors.title) {
                    res.status(400).json({ success: false, msg: err.errors.title.message });
                    return;
                }
                if (err.errors.duration) {
                    res.status(400).json({ success: false, msg: err.errors.duration.message });
                    return;
                }
                if (err.errors.isCoop) {
                    res.status(400).json({ success: false, msg: err.errors.isCoop.message });
                    return;
                }
                if (err.errors.admissionsLink) {
                    res.status(400).json({ success: false, msg: err.errors.admissionsLink.message });
                    return;
                }

                if (err.errors.programCode) {
                    res.status(400).json({ success: false, msg: err.errors.programCode.message });
                    return;
                }
                if (err.errors.deliveryType) {
                    res.status(400).json({ success: false, msg: err.errors.deliveryType.message });
                    return;
                }
                if (err.errors.programStartDate) {
                    res.status(400).json({ success: false, msg: err.errors.programStartDate.message });
                    return;
                }
                if (err.errors.campus) {
                    res.status(400).json({ success: false, msg: err.errors.campus.message });
                    return;
                }
                if (err.errors.credentials) {
                    res.status(400).json({ success: false, msg: err.errors.credentials.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// UPDATE
router.put('/:id', (req, res) => {

    let updatedProgram = {
        title: sanitizeTitle(req.body.title),
        duration: req.body.duration,
        programCode: req.body.programCode,
        deliveryType: req.body.deliveryType,
        isCoop: req.body.isCoop,
        admissionsLink: req.body.admissionsLink,
        programStartDate: req.body.programStartDate,
        campus: req.body.campus,
        credentials: req.body.credentials,
        department: req.body.department,
        programContact: req.body.programContact,
        career: req.body.career,
        handbookLink: req.body.handbookLink
    };

    Program.findOneAndUpdate({ _id: req.params.id }, updatedProgram, { runValidators: true, context: 'query' })
        .then((oldResult) => {
            Program.findOne({ _id: req.params.id })
                .then((newResult) => {
                    res.json({
                        success: true,
                        msg: `Successfully updated!`,
                        result: {
                            _id: newResult._id,
                            title: newResult.title,
                            duration: newResult.duration,
                            programCode: newResult.programCode,
                            deliveryType: newResult.deliveryType,
                            isCoop: newResult.isCoop,
                            admissionsLink: newResult.admissionsLink,
                            programStartDate: newResult.programStartDate,
                            campus: newResult.campus,
                            credentials: newResult.credentials,
                            department: newResult.department,
                            programContact: newResult.programContact,
                            career: newResult.career,
                            handbookLink: newResult.handbookLink
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
                if (err.errors.duration) {
                    res.status(400).json({ success: false, msg: err.errors.duration.message });
                    return;
                }
                if (err.errors.isCoop) {
                    res.status(400).json({ success: false, msg: err.errors.isCoop.message });
                    return;
                }
                if (err.errors.admissionsLink) {
                    res.status(400).json({ success: false, msg: err.errors.admissionsLink.message });
                    return;
                }

                if (err.errors.programCode) {
                    res.status(400).json({ success: false, msg: err.errors.programCode.message });
                    return;
                }
                if (err.errors.deliveryType) {
                    res.status(400).json({ success: false, msg: err.errors.deliveryType.message });
                    return;
                }
                if (err.errors.programStartDate) {
                    res.status(400).json({ success: false, msg: err.errors.programStartDate.message });
                    return;
                }
                if (err.errors.campus) {
                    res.status(400).json({ success: false, msg: err.errors.campus.message });
                    return;
                }
                if (err.errors.credentials) {
                    res.status(400).json({ success: false, msg: err.errors.credentials.message });
                    return;
                }
                // Show failed if all else fails for some reasons
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            }
        });
});

// DELETE
router.delete('/:id', (req, res) => {

    Program.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.json({
                success: true,
                msg: `It has been deleted.`,
                result: {
                    _id: result._id,
                    title: result.title,
                    duration: result.duration,
                    programCode: result.programCode,
                    deliveryType: result.deliveryType,
                    isCoop: result.isCoop,
                    admissionsLink: result.admissionsLink,
                    programStartDate: result.programStartDate,
                    campus: result.campus,
                    credentials: result.credentials,
                    department: result.department,
                    programContact: result.programContact,
                    career: result.career,
                    handbookLink: result.handbookLink

                }
            });
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: 'Nothing to delete.' });
        });
});

module.exports = router;

// Minor sanitizing to be invoked before reaching the database
sanitizeTitle = (title) => {
    return stringCapitalizeName(title);
}

