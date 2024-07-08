// Super Admin
const mongoose = require("mongoose");

const directorschema = new mongoose.Schema({
    name: { type: String,required: true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    designation: {type: String, required: true}
});

const Director = mongoose.model("Director", directorschema);

module.exports = Director;