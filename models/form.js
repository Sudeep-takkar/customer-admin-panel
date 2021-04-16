const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const FormSchema = new Schema({
    formType: {
        type: String
    },
    link: {
        type: String
    },
    info: {
        type: String
    }
});
module.exports = User = mongoose.model("form", FormSchema);