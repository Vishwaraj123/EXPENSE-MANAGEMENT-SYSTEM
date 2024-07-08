//Manager
const mongoose = require("mongoose");

const managerschema = new mongoose.Schema({
    name: { type: String,required: true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    designation: {type: String, required: true}
});

const Manager = mongoose.model("Manager", managerschema);

module.exports = Manager;