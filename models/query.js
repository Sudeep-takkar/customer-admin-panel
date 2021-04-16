const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const QuerySchema = new Schema({
    queryType: {
        type: String
    },
    link: {
        type: String
    },
    info: {
        type: String
    }
});
module.exports = Query = mongoose.model("query", QuerySchema);