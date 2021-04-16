const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const Employments = require('../models/employment');
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
    Employment.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such employment.` });
        });
});

router.get('/', (req, res) => {
    let query = req.query;
    if (!(query && Object.keys(query).length === 0 && query.constructor === Object)) {
        const { fields, ...rest } = query;
        const fieldList = fields ? fields.split(',') : []
        const updatedQuery = _.mapValues(rest, (value) => {
            return { $regex: new RegExp("^" + value.toLowerCase(), "i") }
        })
        Employments.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedEmploymentList = _.reduce(result, (employmentList, value, key) => {
                        let employmentObject = _.pick(value, fieldList)
                        return employmentList.concat(employmentObject)
                    }, []);
                    res.json(modifiedEmploymentList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such Employment.` });
            });
    }
    else {
        Employments.find({})
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            });
    }
});

// employmentType
// employerName
// designation
// description
// wage
// location
// datePosted
// industry
// targetPrograms
// wageType
// expiryDate
module.exports = router;
