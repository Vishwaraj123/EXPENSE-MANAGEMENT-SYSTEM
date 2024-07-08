//Admin
const mongoose = require("mongoose");

const adminschema = new mongoose.Schema({
    name: { type: String,required: true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    designation: {type: String, required: true}
});

const Admin = mongoose.model("Admin", adminschema);

module.exports = Admin;