const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Form = require('../models/form');

const _ = require('lodash')

// READ (ONE)
router.get('/:id', (req, res) => {
    Form.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such Form.` });
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
        Form.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedFormList = _.reduce(result, (progList, value, key) => {
                        const formObject = _.pick(value, fieldList)
                        return progList.concat(formObject)
                    }, []);
                    res.json(modifiedFormList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such Form.` });
            });
    }
    else {
        Form.find({})
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            });
    }
});

module.exports = router;

