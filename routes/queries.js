const express = require('express');
const router = express.Router();

const Query = require('../models/query');

const _ = require('lodash')

// READ (ONE)
router.get('/:id', (req, res) => {
    Query.findById(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(404).json({ success: false, msg: `No such Query.` });
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
        Query.find(updatedQuery)
            .then((result) => {
                if (fieldList.length) {
                    const modifiedQueryList = _.reduce(result, (progList, value, key) => {
                        const queryObject = _.pick(value, fieldList)
                        return progList.concat(queryObject)
                    }, []);
                    res.json(modifiedQueryList);
                } else {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ success: false, msg: `No such Information.` });
            });
    }
    else {
        Query.find({})
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            });
    }
});

module.exports = router;

